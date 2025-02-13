import ReactQuill from 'react-quill';
import './styles/QuillRenderStyle.scss';
interface QuillRenderProps {
  description: string; // The HTML string content
}
const QuillRender = ({ description }: QuillRenderProps) => {
  return (
    <ReactQuill
      value={description}
      readOnly={true}
      modules={{ toolbar: false }}
      className="quill-render"
    />
  );
};

export default QuillRender;
