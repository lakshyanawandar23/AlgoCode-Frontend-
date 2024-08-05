//import { ProblemData } from "../../types/problem.types";
import { useNavigate } from "react-router-dom";

type Problem = {
    description: string,
    title: string,
     editorial:string,
     diffculty:string,
     testCases:string [],
     stubus:string [],
     _id:string
}

function CollapsableTopicProblem({problem}: {problem: Problem}) {
    const navigate=useNavigate();
    const handleSolve=(e:any)=>{
        e.preventDefault();
        console.log("click",problem._id);
     navigate(`/problem/${problem._id}`);
    }
    return (
        <div className=" bg-stone-700 my-4 px-2 py-4">
        
            <div className=" text-xl font-medium flex justify-between">
                <div>
                    {problem.title}
                </div>
                <div>
                    <progress className="progress w-56" value={Math.round(Math.random()*100)} max="100"></progress>
                </div>
                <div>
                    <button className="btn btn-success btn-sm" onClick={handleSolve}>Solve</button>
                </div>
            </div>
            {/* <div className="collapse-content"> 
                {problems.map((problem: ProblemData) => <a className="block" key={problem.url} href={problem.url} target="_blank"> {problem.title} </a>)}
            </div> */}
        </div>
    )
}

export default CollapsableTopicProblem;