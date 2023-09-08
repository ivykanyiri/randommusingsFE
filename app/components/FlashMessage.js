import React, { useContext } from "react";
import StateContext from "../StateContext";

function FlashMessage() {
  const appState = useContext(StateContext);

  return (
    <div className="floating-alerts">
      {appState.flashMessages.map((msg, index) => {
        return (
          <div key={index} className={`alert alert-${msg.type} floating-alert text-center shadow-sm`}>
            {msg.message}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessage;
