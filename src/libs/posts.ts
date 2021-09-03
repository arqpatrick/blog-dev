import fs from 'fs' // file system do node, para poder ler arquivos do sistema
import path from 'path'
import matter from 'gray-matter'

export interface IPost {
  title: string
  date: string
  description: string
  slug: string
  content: string
}

interface IMatterData {
  title: string
  date: string
  description: string
}

const postsDirectory = path.join(process.cwd(), 'posts')

export function getPosts() {
  // Pega os file names dentro de /posts
  const fileNames = fs.readdirSync(postsDirectory)

  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" do nome do arquivo para ter o slug
    const slug = fileName.replace(/\.md$/, '')

    // Ler o arquivo markdown como uma string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Usa o gray-matter para analisar a seção de metadata do post
    const matterResult = matter(fileContents)

    // Combina os dados com o slug
    return {
      slug,
      content: matterResult.content,
      ...(matterResult.data as IMatterData),
    }
  })
  // Lista posts pela data
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if(a < b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  })
}

export function getPostBySlug(findSlug: string) {
  // Pega o nome do arquivo dentro de /posts
  const fileNames = fs.readdirSync(postsDirectory)

  // Busca arquivo pelo slug
  const file = fileNames.find((fileName) => fileName.includes(findSlug))

  if (!file) return null

  // Remove ".md" do nome do arquivo para pegar o slug
  const slug = file.replace(/\.md$/, '')

  // Ler markdown como uma string
  const fullPath = path.join(postsDirectory, file)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Usa gray-matter para analisar a seção de metadata do post
  const matterResult = matter(fileContents)

  // Combina os dados com a slug
  return {
    slug,
    content: matterResult.content,
    ...(matterResult.data as IMatterData),
  }
}

export function getPostsSlugs() {
  // Pega o nome do arquivo dentro de /posts
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''))
}
