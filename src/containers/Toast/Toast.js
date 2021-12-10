import React from 'react';
import classes from './Toast.module.css';

const Toast = (props) => {

    return (
        <div classname={classes.toastContainer} style={{display:props.display ? 'block' : 'none'}}>
            <div className={classes.toast} >
                <div className={classes.toastMessage}
                
                >Logged in Successfully</div>
                <button onClick={props.closeToast} className={classes.button}
                >X</button>
            </div>
        </div>
    )
}

export default Toast
