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
        [{ header: '2' }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link'],
        [{ align: [] }],
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
