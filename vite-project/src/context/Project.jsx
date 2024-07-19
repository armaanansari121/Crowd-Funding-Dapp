// import { createContext, useContext } from "react";
// import { useWeb3 } from "./Web3";
// import { useProjectManager } from "./ProjectManager";
// import { useParams } from "react-router-dom";
// import projectBuild from "../../../truffle/build/contracts/Project.json";

// const ProjectContext = createContext();

// function ProjectProvider({ children }) {
//   const { web3 } = useWeb3();
//   const { dispatch } = useProjectManager();
//   const { address } = useParams();

//   async function loadProject(address) {
//     try {
//       const projectABI = projectBuild.abi;
//       const projectInstance = new web3.eth.Contract(projectABI, address);

//       const creator = await projectInstance.methods.creator().call();
//       const receiver = await projectInstance.methods.receiver().call();
//       const fundingDeadline = await projectInstance.methods
//         .fundingDeadline()
//         .call();
//       const refundDeadline = await projectInstance.methods
//         .refundDeadline()
//         .call();
//       const name = await projectInstance.methods.name().call();
//       const description = await projectInstance.methods.description().call();
//       const goal = await projectInstance.methods.goal().call();
//       const raised = await projectInstance.methods.raised().call();
//       const state = await projectInstance.methods.state().call();

//       const project = {
//         projectInstance,
//         creator,
//         receiver,
//         name,
//         description,
//         goal,
//         raised,
//         fundingDeadline,
//         refundDeadline,
//         state,
//       };

//       dispatch({ type: "project/loaded", payload: { address, project } });
//     } catch (error) {
//       dispatch({ type: "project/error", payload: error.message });
//     }
//   }

//   useEffect(() => {
//     const fetchProject = async () => {
//       if (web3 && Object.keys(project).length === 0) {
//         await loadProject(address);
//       } else if (Object.keys(project).length !== 0) {
//         dispatch({ type: "project/loaded", payload: { address, project } });
//       }
//     };
//     fetchProject();
//   }, [web3, address]);

//   return <ProjectContext.Provider>{children}</ProjectContext.Provider>;
// }

// function useProject() {
//   const context = useContext(ProjectContext);
//   if (context === undefined) {
//     throw new Error("Project Context cannot be used outside Project Provider.");
//   }
//   return context;
// }

// export { ProjectProvider, useProject };
