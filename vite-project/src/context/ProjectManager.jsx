import { createContext, useContext, useEffect, useReducer } from "react";
import { useWeb3 } from "./Web3";
import projectManagerBuild from "../../../truffle/build/contracts/ProjectManager.json";
import projectBuild from "../../../truffle/build/contracts/Project.json";

const ProjectManagerContext = createContext();

const initialState = {
  projectManagerContract: null,
  projectManagerStates: {
    errorMessage: "",
    successMessage: "",
    isLoading: true,
  },
  projectStates: {
    errorMessage: "",
    successMessage: "",
    isLoading: true,
  },
  projects: [],
  projectNumber: 0,
  projectInstances: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "projectManager/loaded":
      return {
        ...state,
        projectManagerStates: {
          ...state.projectManagerStates,
          isLoading: false,
        },
        projectManagerContract: action.payload.projectManagerContract,
        projects:
          action.payload.projects === null ? [] : action.payload.projects,
        projectNumber: action.payload.projectNumber,
        projectInstances: action.payload.projectInstances,
      };
    case "projectManager/error":
      return {
        ...state,
        projectManagerStates: {
          ...state.projectManagerStates,
          isLoading: false,
          errorMessage: action.payload,
        },
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
        projectManagerStates: {
          ...state.projectManagerStates,
          isLoading: false,
          errorMessage: "",
          successMessage: `Project Created Successfully. \nProject Address: ${action.payload}`,
        },
        projectInstances: { ...state.projectInstances, [action.payload]: {} },
      };
    case "projectCreation/failed":
      return {
        ...state,
        projectManagerStates: {
          ...state.projectManagerStates,
          errorMessage: action.payload,
          successMessage: "",
          isLoading: false,
        },
      };
    case "project/loaded":
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          isLoading: false,
        },
        projectInstances: {
          ...state.projectInstances,
          [action.payload.address]: action.payload.project,
        },
      };
    case "project/error":
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          isLoading: false,
          errorMessage: action.payload,
        },
      };
    case "projectManager/loading":
      return {
        ...state,
        projectManagerStates: {
          ...state.projectManagerStates,
          isLoading: true,
        },
      };
    case "project/loading":
      console.log(state);
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          isLoading: true,
        },
      };
    case "project/donation/success":
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          isLoading: false,
          successMessage: action.payload.successMessage,
        },
        projectInstances: {
          ...state.projectInstances,
          [action.payload.address]: {
            ...state.projectInstances[action.payload.address],
            raised: action.payload.raised,
          },
        },
      };
    case "project/refund/success":
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          isLoading: false,
          successMessage: action.payload.successMessage,
        },
        projectInstances: {
          ...state.projectInstances,
          [action.payload.address]: {
            ...state.projectInstances[action.payload.address],
            raised: action.payload.raised,
          },
        },
      };
    case "project/payment/success": {
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          isLoading: false,
          successMessage: action.payload.successMessage,
        },
        projectInstances: {
          ...state.projectInstances,
          [action.payload.address]: {
            ...state.projectInstances[action.payload.address],
            state: action.payload.state,
          },
        },
      };
    }
    case "projectManager/resetMessages": {
      return {
        ...state,
        projectManagerStates: {
          ...state.projectManagerStates,
          errorMessage: "",
          successMessage: "",
        },
      };
    }
    case "project/resetMessages": {
      return {
        ...state,
        projectStates: {
          ...state.projectStates,
          errorMessage: "",
          successMessage: "",
        },
      };
    }
  }
}

function ProjectManagerProvider({ children }) {
  const { web3, selectedAccount } = useWeb3();
  const projectManagerABI = projectManagerBuild.abi;
  const projectManagerAddress = projectManagerBuild.networks[11155111].address;
  const [
    {
      projectManagerContract,
      projectManagerStates,
      projectStates,
      projects,
      projectNumber,
      projectInstances,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    async function initContract() {
      if (web3) {
        try {
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
        } catch (err) {
          dispatch({
            type: "projectManager/error",
            payload: err.message,
          });
        }
      }
    }
    initContract();
  }, [web3]);

  const handleSubmit = async (form) => {
    try {
      dispatch({ type: "projectManager/loading" });
      const {
        receiverAddress,
        name,
        description,
        goal,
        fundingDeadlineUnix,
        refundDeadlineUnix,
      } = form;

      const gasEstimate = await projectManagerContract.methods
        .createProject(
          receiverAddress,
          name,
          description,
          web3.utils.toWei(goal, "gwei"),
          fundingDeadlineUnix,
          refundDeadlineUnix
        )
        .estimateGas({ from: selectedAccount });

      const gasPrice = await web3.eth.getGasPrice();

      const result = await projectManagerContract.methods
        .createProject(
          receiverAddress,
          name,
          description,
          web3.utils.toWei(goal, "gwei"),
          fundingDeadlineUnix,
          refundDeadlineUnix
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

  async function loadProject(address) {
    try {
      const projectABI = projectBuild.abi;
      const projectInstance = new web3.eth.Contract(projectABI, address);

      const creator = await projectInstance.methods.creator().call();
      const receiver = await projectInstance.methods.receiver().call();
      const fundingDeadline = await projectInstance.methods
        .fundingDeadline()
        .call();
      const refundDeadline = await projectInstance.methods
        .refundDeadline()
        .call();
      const name = await projectInstance.methods.name().call();
      const description = await projectInstance.methods.description().call();
      const goal = await projectInstance.methods.goal().call();
      const raised = await projectInstance.methods.raised().call();
      const state = await projectInstance.methods.state().call();
      // console.log("fetched project");
      const project = {
        projectInstance,
        creator,
        receiver,
        name,
        description,
        goal,
        raised,
        fundingDeadline,
        refundDeadline,
        state,
      };

      dispatch({ type: "project/loaded", payload: { address, project } });
    } catch (error) {
      dispatch({ type: "project/error", payload: error.message });
    }
  }

  return (
    <ProjectManagerContext.Provider
      value={{
        projectManagerStates,
        projectStates,
        projects,
        projectNumber,
        projectInstances,
        handleSubmit,
        loadProject,
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
