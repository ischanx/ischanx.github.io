import { cjk } from '@streamdown/cjk';
import { code } from '@streamdown/code';
import type { PluginConfig } from 'streamdown';
import StreamdownArticle, {
  type StreamdownArticleProps,
} from './StreamdownArticle';

// Streamdown 2.5 types reference Shiki 4 while @streamdown/code 1.1 still
// publishes its compatible token shape against Shiki 3.
const streamdownCode = code as unknown as NonNullable<PluginConfig['code']>;

export default function StreamdownArticleCode(props: StreamdownArticleProps) {
  return (
    <StreamdownArticle
      {...props}
      plugins={{ cjk, code: streamdownCode }}
    />
  );
}
