import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import SideBar from './components/SideBar';
import SampleProblem1 from './constants/SampleProblem1';
import ProblemDescription from './pages/Description/ProblemDescription';
import ProblemList from './pages/ProblemList/ProblemList';
import { StatusProvider } from './context/responsecontext';
import CodeExecution from './context/sockets';
function App() {

  const markdownText = SampleProblem1.problemStatement;
  return (
    <StatusProvider>
    <div className='h-[100vh] overflow-hidden'>
      <Navbar />
      <SideBar />
      <Routes>
        <Route path='/' element={<ProblemList />} />
        <Route path='/problem/:id' element={ <ProblemDescription descriptionText={markdownText} />} />
        <Route path={'/submission'} element={<CodeExecution/>} />
      </Routes>
    </div>
    </StatusProvider>
  );
}

export default App;
