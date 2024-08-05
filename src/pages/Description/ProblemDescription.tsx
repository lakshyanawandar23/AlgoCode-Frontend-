
import { useState, DragEvent, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import "../../imports/AceBuildImports";
import DOMPurify from 'dompurify';

import Languages from '../../constants/Languages';
import Themes from '../../constants/Themes';
//import { useStatus } from '../../context/responsecontext';
import { io, Socket } from 'socket.io-client';
import LoadingButton from '@mui/lab/LoadingButton'
import { useParams } from 'react-router-dom';
type languageSupport = {
    languageName: string,
    value: string
}

type themeStyle = {
    themeName: string,
    value: string
}

function Description({ descriptionText }: {descriptionText: string}) {


    const sanitizedMarkdown = DOMPurify.sanitize(descriptionText);

  //  const {status}=useStatus();
   const {id}=useParams();
   const [probelm,setProbelm]=useState('');
    const [activeTab, setActiveTab] = useState('statement');
    const [testCaseTab, setTestCaseTab] = useState('input');
    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [language, setLanguage] = useState('java');
    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('monokai');
    const [status,setStatus]=useState('output');
    const [loading,setLoading]=useState(false);
    console.log(status);
    useEffect(() => {
        // Connect to the Socket.IO server
        const socket: Socket = io('http://localhost:3001');

        // Set user ID (this could come from an auth system, etc.)
        const userId = '1'; // Replace with the actual user ID
        socket.emit('setUserId', userId);

        // Listen for submission payload responses
        socket.on('submissionPayloadResponse', (payload: any) => {
            console.log(payload.response);
            console.log(payload.userid);
            const size=payload.response.length;
            const result=payload.response[size-1].status;
            console.log(result);
            setStatus(result);
            setLoading(false);
       //     setOutput((prevOutput) => `${prevOutput}\n${payload}`);
        });

        // Listen for connection ID (optional, for debugging)
        socket.on('getConnectionId', (connId: string) => {
            console.log('Connection ID:', connId);
        });

        // Clean up on component unmount
        return () => {
            socket.disconnect();
        };
    }, [status]);
  async function findproblembyid(){
     const response=await axios.get(`http://localhost:5000/api/v1/probelms/${id}`);
      console.log(response.data.data.description);
      setProbelm(response.data.data.description);
    //  DOMPurify.sanitize(probelm);
  }
  findproblembyid();
    async function handleSubmission() {
        try {
            console.log(code)
            console.log(language)
            const response = await axios.post("http://localhost:3002/api/v1/submission", {
                code,
                language,
                userId: "1",
                probelmId:id
            });
        //    setStatus("Pending");
            console.log(response);
         //   setLoading(true);
            return response;
        } catch(error) {
            console.log(error);
        }
    }

    const startDragging = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.preventDefault();
    }

    const stopDragging = () => {
        if(isDragging) {
            setIsDragging(false);
        }
    }

    const onDrag = (e: DragEvent<HTMLDivElement>) => {
        if(!isDragging) return;
        
        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        if(newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }

    }

    const isActiveTab = (tabName: string) => {
        if(activeTab === tabName) {
            return 'tab tab-active';
        } else {
            return 'tab'
        }
    }

    const isInputTabActive = (tabName: string) => {
        if(testCaseTab === tabName) {
            return 'tab tab-active';
        } else {
            return 'tab';
        }
    }



    return (
        <div 
            className='flex w-screen h-[calc(100vh-57px)]'
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
            
        >

            <div className='leftPanel h-full overflow-auto' style={{ width: `${leftWidth}%`}}>

                <div role="tablist" className="tabs tabs-boxed w-3/5">
                    <a onClick={() => setActiveTab('statement')} role="tab" className={isActiveTab("statement")}>Problem Statement</a>
                    <a onClick={() => setActiveTab('editorial')} role="tab" className={isActiveTab("editorial")}>Editorial</a>
                    <a onClick={() => setActiveTab('submissions')} role="tab" className={isActiveTab("submissions")}>Submissions</a>
                </div>
           {
            activeTab==="statement" ?
                <div className='markdownViewer p-[20px] basis-1/2'>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">
                        {probelm}
                    </ReactMarkdown>
                </div>:
                <div className='font-bold text-3xl'>
                    Coming Soon 
                    </div>
}
            </div>

            <div className='divider cursor-col-resize w-[5px] bg-slate-200 h-full' onMouseDown={startDragging}></div>

            <div className='rightPanel h-full overflow-auto flex flex-col' style={{ width: `${100-leftWidth}%`}}>

                <div className='flex gap-x-1.5 justify-start items-center px-4 py-2 basis-[5%]'>
                    <div>
                        <button className="btn btn-success btn-sm" onClick={handleSubmission}>Submit</button>
                    </div>
                    <div>
                        <button className="btn btn-warning btn-sm">Run Code</button>
                    </div>
                    <div>
                        <select 
                            className="select select-info w-full select-sm max-w-xs" 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            
                            {Languages.map((language: languageSupport) => (
                                <option key={language.value} value={language.value}> {language.languageName} </option>
                            ))}
                        </select>
                    </div>
                    <select 
                            className="select select-info w-50 select-sm max-w-xs" 
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        > 
                            {Themes.map((theme: themeStyle) => (
                                <option key={theme.value} value={theme.value}> {theme.themeName} </option>
                            ))}
                        </select>
                        {/* <div className=" ml-8 text-bold">
                            {status}
                        </div> */}
                           <LoadingButton
          color="secondary"
        //  onClick={handleClick}
          loading={loading}
          loadingPosition="start"
         // startIcon={<SaveIcon />}
          variant="contained"
        >
          <span>{status}</span>
        </LoadingButton>
                    </div>
                    <div>
                </div>
                
                <div className="flex flex-col editor-console grow-[1] ">

                    <div className='editorContainer grow-[1]'>
                        <AceEditor
                            mode={language}
                            theme={theme}
                            value={code}
                            onChange={(e: string) => setCode(e)}
                            name='codeEditor'
                            className='editor'
                            style={{ width: '100%'}}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                showLineNumbers: true,
                                fontSize: 16
                            }}
                            height='100%'
                        />
                    </div>

                    { /* Collapsable test case part */ }

                    <div className="collapse bg-base-200 rounded-none">
                        <input type="checkbox" className="peer" /> 
                        <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                            Console
                        </div>
                        {/* <div className=" me-8 collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                            {status}
                        </div> */}
                        <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content"> 
                        <div role="tablist" className="tabs tabs-boxed w-3/5 mb-4">
                            <a onClick={() => setTestCaseTab('input')} role="tab" className={isInputTabActive('input')}>Input</a>
                            <a onClick={() => setTestCaseTab('output')} role="tab" className={isInputTabActive('output')}>Output</a>
                        </div>
                            
                            {(testCaseTab === 'input') ? <textarea rows={4} cols={70} className='bg-neutral text-white rounded-md resize-none'/> : <div className='w-12 h-8'></div>}
                        </div>
                    </div>
                
                </div>

            </div>

        </div>
    )

}

export default Description;
