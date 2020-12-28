import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

export default function Instructions(props){
    return (
        <div>
            <div className="text-center"><h4>Please read the instructions carefully</h4></div>
                <ol>
                    <li>
                        <b>General Instructions:</b>
                        <ul>
                            <li>Total duration of JEE Main Paper- 1 & JEE Main Paper- 2 is 180 min.</li>
                            <li>JEE Paper- 2 is for Mathematics, Aptitude Test & Drawing. The Drawing test is required to be done on separate drawing sheet, which is not part of the current mock test.</li>
                        </ul>
                    </li>
                    <li>
                        The clock will be set at the server. The countdown timer will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You can submit your examination if you want by clicking at the <button className="btn btn-danger">Submit Test</button> button.
                    </li>
                    <li>
                        The Questions Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
                        <ul>
                            <li><button className="btn btn-hollow">You have not visited the question yet.</button></li>
                            <li><button className="btn btn-hollow">You have not answered the question.</button></li>
                            <li><button className="btn btn-hollow">You have answered the question.</button></li>
                            <li><button className="btn btn-hollow">You have NOT answered the question, but have marked the question for review.</button></li>
                            <li> The question(s) <button className="btn btn-hollow">Answered and Marked for Review</button> will be considered for evalution.</li>   
                        </ul>
                    </li>
                    <li>
                        You can click on the <button className="btn btn-warning"><BsArrowLeft /></button>
                        and <button className="btn btn-warning"><BsArrowRight /></button>
                        buttons to navigate through the questions. You can also click on the numerical buttons to go to specific questions.
                    </li>
                    <li>
                        To answer a question, do the following:
                        a. Click on <button className="btn btn-success">Save and Next</button>to save your answer for the current question and then go to the next question.<br />
                        b. Click on <button className="btn btn-info">Save and mark for review</button>to save your answer for the current question, mark it for review, and then go to the next question.
                    </li>
                    Answering a Question:
                    <li>
                        Procedure for answering a question:<br />
                        a. To select you answer, click on the choice of the corresponding answer.<br />
                        b. To deselect your chosen answer, click on the <button className="btn btn-secondary">Clear</button>button<br />
                        c. To change your chosen answer, click on the button of another option<br />
                        d. To save your answer, click on the <button className="btn btn-success">Save and Next</button> button.<br />
                        e. To mark the question for review, click on the <button className="btn btn-info">Mark for review and next</button>button.
                    </li>
                    <li> To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.</li>
                    Navigating through sections:
                    <li>Sections in this question paper are displayed on the top bar of the screen. Questions in a section can be viewed by click on the section name.</li>
                    <li> After clicking the Save & Next button on the last question for a section, you will automatically be taken to the first question of the next section.</li>
                    <li> You can shuffle between sections and questions anything during the examination as per your convenience only during the time stipulated.</li>
                </ol>
                Please note that all questions will appear in English.
                <br /><br />
            <p className="mt-bold">I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations</p>
        </div>
    )
}