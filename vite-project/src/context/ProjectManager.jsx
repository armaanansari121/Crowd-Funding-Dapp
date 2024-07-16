import { createContext, useContext, useEffect, useReducer } from "react";
import { useWeb3 } from "./Web3";
import projectManagerBuild from "../../../truffle/build/contracts/ProjectManager.json";

const ProjectManagerContext = createContext();

const initialState = {
  projectManagerContract: null,
  errorMessage: "",
  successMessage: "",
  isLoading: true,
  projects: [],
  projectNumber: 0,
  projectInstances: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "projectManager/loaded":
      return {
        ...state,
        isLoading: false,
        projectManagerContract: action.payload.projectManagerContract,
        projects:
          action.payload.projects === null ? [] : action.payload.projects,
        projectNumber: action.payload.projectNumber,
        projectInstances: action.payload.projectInstances,
      };
    case "projectInstances/loaded":
      return {
        ...state,
        projectInstances: action.payload,
      };
    case "projectCreation/successfull":
      return {
        ...state,
        projects: [...state.projects, action.payload],
        projectNumber: state.projectNumber + 1n,
        isLoading: false,
        errorMessage: "",
        successMessage: `Project Created Successfully. \nProject Address: ${action.payload}`,
        projectInstances: { ...state.projectInstances, [action.payload]: {} },
      };
    case "projectCreation/failed":
      return {
        ...state,
        errorMessage: action.payload,
        successMessage: "",
        isLoading: false,
      };
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
  }
}

function ProjectManagerProvider({ children }) {
  const { web3, selectedAccount } = useWeb3();
  const projectManagerABI = projectManagerBuild.abi;
  const projectManagerAddress = projectManagerBuild.networks[17000].address;
  const [
    {
      projectManagerContract,
      errorMessage,
      successMessage,
      isLoading,
      projectNumber,
      projects,
      projectInstances,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  console.log(projectInstances);

  useEffect(() => {
    async function initContract() {
      if (web3) {
        const projectManagerInstance = new web3.eth.Contract(
          projectManagerABI,
          projectManagerAddress
        );
        const fetchedProjects = [];
        const projectInstancesInit = {};
        const fetchedProjectNumber = await projectManagerInstance.methods
          .projectNumber()
          .call();
        for (let i = 1; i < fetchedProjectNumber; i++) {
          const projectAddress = await projectManagerInstance.methods
            .projects(i)
            .call();
          fetchedProjects.push(projectAddress);
          projectInstancesInit[projectAddress] = {};
        }
        dispatch({
          type: "projectManager/loaded",
          payload: {
            projectManagerContract: projectManagerInstance,
            projects: fetchedProjects,
            projectNumber: fetchedProjectNumber,
            projectInstances: projectInstancesInit,
          },
        });
      }
    }
    initContract();
  }, [web3]);

  const handleSubmit = async (form) => {
    try {
      dispatch({ type: "loading" });
      const {
        receiverAddress,
        name,
        description,
        goal,
        fundingDuration,
        refundDuration,
      } = form;

      // Estimate gas
      const gasEstimate = await projectManagerContract.methods
        .createProject(
          receiverAddress,
          name,
          description,
          web3.utils.toWei(goal, "gwei"),
          fundingDuration,
          refundDuration
        )
        .estimateGas({ from: selectedAccount });

      const gasPrice = await web3.eth.getGasPrice();

      // Send transaction
      const result = await projectManagerContract.methods
        .createProject(
          receiverAddress,
          name,
          description,
          web3.utils.toWei(goal, "gwei"),
          fundingDuration,
          refundDuration
        )
        .send({
          from: selectedAccount,
          gas: gasEstimate,
          gasPrice: gasPrice,
        });
      console.log("Transaction Result:", result);

      const newProject = await projectManagerContract.methods
        .projects(projects.length + 1)
        .call();
      dispatch({ type: "projectCreation/successfull", payload: newProject });
    } catch (error) {
      dispatch({ type: "projectCreation/failed", payload: error.message });
    }
  };

  return (
    <ProjectManagerContext.Provider
      value={{
        errorMessage,
        isLoading,
        projects,
        projectNumber,
        successMessage,
        projectInstances,
        handleSubmit,
        dispatch,
      }}
    >
      {children}
    </ProjectManagerContext.Provider>
  );
}

function useProjectManager() {
  const context = useContext(ProjectManagerContext);
  if (context === undefined)
    throw new Error(
      "Project Manager Context cannot be used outside Project Manager Provider"
    );
  return context;
}

export { ProjectManagerProvider, useProjectManager };
