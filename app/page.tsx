import Link from 'next/link'
import { htmlToText } from 'html-to-text'
import { Cover } from '@/components/Cover'
import { getApp, getArticles, getCategories } from '@/lib/newt'
import styles from '@/styles/Home.module.css'

export default async function Page() {
  const app = await getApp()
  const { articles } = await getArticles({
    limit: Number(process.env.NEXT_PUBLIC_PAGE_LIMIT) || 10,
  })
  const categories = await getCategories()

  return (
    <main>
      {app.cover?.value && <Cover />}
      <div className={styles.Container}>
        <div className={styles.Categories}>
          {categories.map((category) => (
            <div className={styles.Category} key={category._id}>
              <Link
                className={styles.Category_Link}
                href={`/categories/${category.slug}`}
              >
                <em>{category.emoji.value}</em>
                <div className={styles.Category_Text}>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className={styles.Articles}>
          <h2 className={styles.Articles_Heading}>Recent articles</h2>
          <div className={styles.Articles_Inner}>
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
          </div>
        </div>
      </div>
    </main>
  )
}
