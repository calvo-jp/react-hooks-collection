import clsx from "clsx";
import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import path from "path";
import rehypePresetMinify from "rehype-preset-minify";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Params = {
  slug: string[];
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

type Props = {
  files: {
    slug: string;
    name: string;
    repo: string;
  }[];
  active: {
    slug: string;
    name: string;
    body: string;
    repo: string;
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const encoding: BufferEncoding = "utf-8";
  const location = path.join(process.cwd(), "hooks");

  try {
    const files = fs
      .readdirSync(location, { encoding })
      .filter((file) => !file.endsWith(".spec.tsx"))
      .sort((i, j) => i.localeCompare(j))
      .map((name) => {
        const slug = name.replace(path.extname(name), "");
        const repo = "https://github.com/calvo-jp/hooks/tree/hooks/" + name;

        return {
          slug,
          name,
          repo,
        };
      });

    const slug = params?.slug?.at(0);
    const active = !slug
      ? files.at(0)
      : files.find((file) => file.slug === slug);

    if (!active) throw new Error("");

    const prefix = "```ts\n";
    const suffix = "```";
    const content = fs.readFileSync(path.join(location, active.name), {
      encoding,
    });

    const body = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .use(rehypePrism, { showLineNumbers: true, ignoreMissing: true })
      .use(rehypePresetMinify)
      .processSync(prefix + content + suffix)
      .toString();

    return {
      props: {
        files,
        active: { ...active, body },
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function Index({ files, active }: Props) {
  return (
    <div className="flex items-start justify-center">
      <nav className="sticky top-0 p-4 md:p-8 lg:p-16">
        <ul className="flex flex-col lg:gap-0.5">
          {files.map(({ slug, name }) => (
            <li key={slug}>
              <Link
                href={`/${slug}`}
                className={clsx(
                  "transition-colors duration-300 hover:text-sky-700",
                  slug === active.slug && "text-sky-700",
                )}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main className="grow p-4 md:p-8 lg:p-16">
        <div
          className="prose prose-neutral w-full max-w-none lg:prose-lg prose-headings:font-serif prose-a:text-sky-600 prose-a:no-underline prose-pre:w-fit prose-pre:max-w-full prose-pre:rounded-none prose-pre:bg-neutral-50 prose-pre:p-6 prose-pre:text-neutral-800 prose-ul:p-0 prose-li:list-inside prose-li:p-0 prose-li:marker:text-neutral-300 prose-img:max-h-[560px]"
          dangerouslySetInnerHTML={{
            __html: active.body,
          }}
        />
      </main>
    </div>
  );
}
