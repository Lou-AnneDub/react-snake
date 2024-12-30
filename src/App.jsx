import Board from './components/Board/Board';
import Toggle from './components/Toggle/Toggle';
import {useDropzone} from 'react-dropzone';
import useStore from './utils/store';

function App() {
  const { skin, setSkin } = useStore();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/svg": []
    },
    maxFiles: 1,
    noClick: true,
    onDrop: (file) => onDrop(file),
  });

  const onDrop = (file) => {
    const src = URL.createObjectURL(file[0]);
    setSkin(src);
  }

  return (
    <div className="App">
      <video
        src="/nether.mp4"
        id="nether-video"
        className="nether-video"
        autoPlay
        loop
        muted
      ></video>

      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        {skin && <img src={skin} alt="" />}
      </div>

      <div className="flashbang"></div>
      <div className="contour">
        <Board />
      </div>
      <div className="toggle-wrapper">
        <Toggle mode={"corner"} />
        <Toggle mode={"impossible"} />
        <Toggle mode={"reversed"} />
      </div>
    </div>
  );
}

export default App;
