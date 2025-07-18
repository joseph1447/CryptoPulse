
// This component is currently not in use. The logic has been moved to a single page component
// to render markdown content from the README.md file. This approach is more maintainable
// as it avoids duplicating the documentation content.
//
// You can safely delete this file if you do not plan to have other static pages
// that are not part of the dynamic routing system.
import { promises as fs } from 'fs';
import path from 'path';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DocsPage() {
  const readmePath = path.join(process.cwd(), 'README.md');
  const fileContents = await fs.readFile(readmePath, 'utf8');

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(fileContents);
  const contentHtml = processedContent.toString();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Documentation</CardTitle>
        </CardHeader>
        <CardContent>
            <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }} 
            />
        </CardContent>
      </Card>
    </div>
  );
}
