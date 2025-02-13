import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.scss';
interface ReactQuillComponentProps extends ReactQuillProps {
  className?: string;
}
const ReactQuillComponent = ({
  className,
  ...props
}: ReactQuillComponentProps) => {
  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { header: '3' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ size: ['small', 'normal', 'large'] }],
        ['link'],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['clean'],
      ],
    },
  };
  return (
    <ReactQuill
      className={`react-quill-component ${className}`}
      modules={modules}
      placeholder="Enter..."
      {...props}
    />
  );
};

export default ReactQuillComponent;
