import CollapsableTopicProblem from "./CollapsableTopicProblems";
//import SampleProblemList from "../../constants/SampleProblemList";
//import { ProblemData } from "../../types/problem.types";
import axios from "axios";
import { useEffect, useState } from "react";

type Problem = {
    description: string,
    title: string,
     editorial:string,
     diffculty:string,
     testCases:string [],
     stubus:string [],
     _id:string
}
   

function ProblemList() {
    const [problemlist,setProblemlist]=useState([]);
    async function list() {
        try {
         const response=await axios.get("http://localhost:5000/api/v1/probelms");
         console.log(response.data.data);
         setProblemlist(response.data.data);
         console.log(problemlist);
        }
        catch(e){
         console.log(e);
        }
      }
      useEffect(()=>{
        list();
      },[]);
      
    return (
        <div className="flex justify-center items-center w-[100vw]">

            <div className="topic-list flex flex-col w-[60%]">
                    
                   {problemlist&&problemlist.map((problem: Problem) => <CollapsableTopicProblem problem={problem} key={problem._id} />)}
            </div>


        </div>
    )
}

export default ProblemList;