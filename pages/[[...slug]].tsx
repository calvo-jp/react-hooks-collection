import { useToast, withToast } from "@/components/toast";
import useClipboard from "@/hooks/use-clipboard";
import clsx from "clsx";
import fs from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import path from "path";
import { useEffect } from "react";
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
  const location = path.join(process.cwd(), "hooks");

  const paths = fs
    .readdirSync(location, { encoding: "utf-8" })
    .filter((file) => !file.endsWith(".spec.tsx"))
    .map((filename) => ({
      params: { slug: [filename.replace(path.extname(filename), "")] },
    }));

  return {
    paths,
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
    rawContent: string;
  };
};

const repo_base = "https://github.com/calvo-jp/react-hooks/tree/main/hooks/";

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const location = path.join(process.cwd(), "hooks");

  try {
    const files = fs
      .readdirSync(location, { encoding: "utf-8" })
      .filter((file) => file.endsWith(".tsx") && !file.endsWith(".spec.tsx"))
      .sort((i, j) => i.localeCompare(j))
      .map((name) => {
        const slug = name.replace(path.extname(name), "");
        const repo = repo_base + name;

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

    const rawContent = fs.readFileSync(path.join(location, active.name), {
      encoding: "utf-8",
    });

    const body = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .use(rehypePrism, { showLineNumbers: true, ignoreMissing: true })
      .use(rehypePresetMinify)
      .processSync("```ts\n" + rawContent + "```")
      .toString();

    return {
      props: {
        files,
        active: { ...active, body, rawContent },
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function Index({ files, active }: Props) {
  return (
    <div className="flex items-start justify-center">
      <CopyShortcut>{active.rawContent}</CopyShortcut>

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

      <main className="flex min-h-screen grow flex-col p-4 md:p-8 lg:p-16">
        <div
          className="prose prose-neutral w-full max-w-none grow lg:prose-lg prose-pre:w-fit prose-pre:max-w-full prose-pre:rounded-none prose-pre:bg-neutral-50 prose-pre:p-6 prose-pre:text-neutral-800"
          dangerouslySetInnerHTML={{
            __html: active.body,
          }}
        />
      </main>
    </div>
  );
}

const CopyShortcut = withToast(function CopyShortcut({
  children,
}: {
  children: string;
}) {
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(children, {
    timeout: 3000,
  });

  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if (hasCopied) return;

      if (e.ctrlKey && e.code === "KeyC") {
        e.preventDefault();
        e.stopPropagation();

        onCopy();

        toast.success({
          placement: "bottom-end",
          description: "Code has been copied",
          duration: 3000,
        });
      }
    };

    document.addEventListener("keydown", handleCopy);

    return () => {
      document.removeEventListener("keydown", handleCopy);
    };
  }, [
    //
    toast,
    hasCopied,
    onCopy,
  ]);

  return null;
});
