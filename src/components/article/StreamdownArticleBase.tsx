import { cjk } from '@streamdown/cjk';
import StreamdownArticle, {
  type StreamdownArticleProps,
} from './StreamdownArticle';

export default function StreamdownArticleBase(props: StreamdownArticleProps) {
  return <StreamdownArticle {...props} plugins={{ cjk }} />;
}
