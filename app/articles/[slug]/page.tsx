import Link from 'next/link'
import { notFound } from 'next/navigation'
import { htmlToText } from 'html-to-text'
import { getArticles, getArticle } from '@/lib/newt'
import styles from '@/styles/Article.module.css'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const { articles } = await getArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  const { slug } = params
  const article = await getArticle(slug)

  const title = article?.meta?.title || article?.title
  const bodyDescription = htmlToText(article?.body || '', {
    selectors: [{ selector: 'img', format: 'skip' }],
  }).slice(0, 200)
  const description = article?.meta?.description || bodyDescription
  const ogImage = article?.meta?.ogImage?.src

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      images: ogImage,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = params
  const article = await getArticle(slug)
  if (!article) {
    notFound()
  }

  const { articles: relatedArticles } = await getArticles({
    tags: { in: article.tags },
    slug: {
      ne: article.slug,
    },
    limit: Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
  })

  return (
    <main className={styles.Container}>
      <article className={styles.Article}>
        <div className={styles.Article_Header}>
          <ul className={styles.Breadcrumb}>
            <li className={styles.Breadcrumb_Item}>
              <Link className={styles.Breadcrumb_Link} href="/">
                Home
              </Link>
            </li>
            {article.category && (
              <li className={styles.Breadcrumb_Item}>
                <Link
                  className={styles.Breadcrumb_Link}
                  href={`/categories/${article.category.slug}`}
                >
                  {article.category.name}
                </Link>
              </li>
            )}
          </ul>
          <h1 className={styles.Article_Title}>{article.title}</h1>
        </div>
        <div
          className={styles.Article_Body}
          dangerouslySetInnerHTML={{ __html: article.body }}
        ></div>
        <section className={styles.Related}>
          <h2 className={styles.Related_Heading}>Related articles</h2>
          <ul className={styles.Related_List}>
            {relatedArticles.map((article) => (
              <li className={styles.Related_Item} key={article._id}>
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  )
}
