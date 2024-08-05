import  React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useStatus } from './responsecontext';
// type PayloadResponse ={
//     output: string;
//     status: string;
// }


const CodeExecution:React.FC=()=>{
    
    const {status,setStatus}=useStatus();
    const [output,setOutput]=useState<string>();
    setStatus('Output');
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
           setOutput((prevOutput) => `${prevOutput}\n${payload}`);
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

    return (
        <div>
          <h1>Code Execution Status</h1>
          <p>Status: {status}</p>
          <pre>{output}</pre>
        </div>
      );
};


export default CodeExecution;
