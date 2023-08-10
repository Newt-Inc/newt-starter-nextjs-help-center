import Link from 'next/link'
import { notFound } from 'next/navigation'
import { htmlToText } from 'html-to-text'
import { Pagination } from '@/components/Pagination'
import { getArticles, getCategories, getCategory } from '@/lib/newt'
import styles from '@/styles/Category.module.css'

type Props = {
  params: {
    slug: string
    page?: string[]
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10

  const params: { slug: string; page?: string[] }[] = []
  await categories.reduce(async (prevPromise, category) => {
    await prevPromise

    const { total } = await getArticles({
      category: category._id,
    })
    const maxPage = Math.ceil(total / limit)
    const pages = Array.from({ length: maxPage }, (_, index) => index + 1)

    params.push({
      slug: category.slug,
      page: undefined,
    })
    pages.forEach((page) => {
      params.push({
        slug: category.slug,
        page: [page.toString()],
      })
    })
  }, Promise.resolve())
  return params
}
export const dynamicParams = false

export default async function Page({ params }: Props) {
  const { slug, page: _page } = params
  const page = Number(_page) || 1

  const category = await getCategory(slug)
  if (!category) {
    notFound()
  }

  const limit = Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10
  const { articles, total } = await getArticles({
    category: category._id,
    limit,
    skip: limit * (page - 1),
  })

  return (
    <main>
      <div className={styles.Container}>
        <div className={styles.Category_Header}>
          <em>{category.emoji.value}</em>
          <div className={styles.Category_Text}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
          </div>
        </div>
        <div className={styles.Articles}>
          {articles.map((article) => (
            <article className={styles.Article} key={article._id}>
              <Link
                className={styles.Article_Link}
                href={`/articles/${article.slug}`}
              >
                <h3 className={styles.Article_Title}>{article.title}</h3>
                <p className={styles.Article_Description}>
                  {htmlToText(article.body, {
                    selectors: [{ selector: 'img', format: 'skip' }],
                  })}
                </p>
              </Link>
            </article>
          ))}
          <Pagination
            total={total}
            current={page}
            basePath={`/categories/${category.slug}`}
          />
        </div>
      </div>
    </main>
  )
}
