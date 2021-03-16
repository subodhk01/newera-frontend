export const QUESTION_TYPE = {
    0: "Single Correct",
    1: "Multiple Correct",
    2: "Numerical",
    3: "Matrix Match",
}

export const TEST_STATUS = {
    0: "Not Started",
    1: "LIVE",
    2: "Ended",
    3: "Ended",
    4: "Ended"
}

export const TEST_SERIES_STATUS = {
    0: "User not authorized",
    1: "User is not a student",
    2: "Not Registered",
    3: "Payment not verified",
    4: "Registered"
}

export const SIDEBAR_ITEMS = [
    {
        image: "",
        title: "Profile",
        path: "/profile"
    },
    {
        image: "",
        title: "My Tests",
        path: "/tests"
    },
    {
        image: "",
        title: "My Test Series",
        path: "/testseries"
    },
    {
        image: "",
        title: "My Videos",
        path: "/videos"
    },
    {
        image: "",
        title: "My Lecture Series",
        path: "/lectureseries"
    },
    {
        image: "",
        title: "My Study Materials",
        path: "/studymaterials"
    },
    {
        image: "",
        title: "My Forum Channels",
        path: "/channels"
    },
    {
        image: "",
        title: "Ask Your Teachers",
        path: "/teacherchannels"
    },
    {
        image: "",
        title: "Send Notification",
        path: "/notification",
        teacher: true
    },
    {
        image: "",
        title: "Image Upload",
        path: "/image_upload",
        teacher: true
    },
]

export const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    content: {
        borderRadius: "10px",
        background: "white",
        boxShadow: "0px 0px 30px 6px #ecf0f7",
        border: "none"
    }
};
export const customStyles2 = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        position: 'absolute',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: "10px",
        background: "white",
        boxShadow: "0px 0px 30px 6px #ecf0f7",
        border: "none",
        maxWidth: "90vw"
    }
};