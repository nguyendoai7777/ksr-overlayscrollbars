// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import NxWelcome from './components/welcome.component';
import { ProvideWindowScroll } from 'rx-scrollable';

export function App() {
  return (
    <>
      <div>
        <NxWelcome title="demo-react" />
      </div>
    </>
  );
}

export default App;
