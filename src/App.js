import './App.css';
import LoginPage from "./mycomponents/LoginPage";
import CREATE from "./mycomponents/createaccount";
import DASHBOARD from "./mycomponents/dashboard";
import NEWTASK from "./mycomponents/newtask"
import CREATETEAM from "./mycomponents/createteam";
import EDITTEAM from "./mycomponents/addmember";
import AddMember from "./mycomponents/newmember"
import ManagerAssign from "./mycomponents/managerassigning";
import Work from "./mycomponents/submitwork";
import AuditorTaskDetail from "./mycomponents/Auditortaskdetail";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './msalConfig';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/auditor-task/:taskId" element={<AuditorTaskDetail />} />
            <Route path="/task/:id" element={<ManagerAssign />} />
            <Route path="/addmember/:id" element={<EDITTEAM />} />
            <Route path="/add-member/:teamId" element={<AddMember />} />
            <Route path="/newteam" element={<CREATETEAM />} />
            <Route path="/newtask" element={<NEWTASK />} />
            <Route path="/dashboard" element={<DASHBOARD />} />
            <Route path="/create" element={<CREATE />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/employee-task/:id" element={<Work />} />
          </Routes>
        </Router>
      </div>
    </MsalProvider>
  );
}

export default App;
