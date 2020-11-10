import { CgMenuLeftAlt } from 'react-icons/cg'
import { IoIosHelpCircle } from 'react-icons/io'
import { PRIMARY_DARK } from '../../utils/Colors'

export default function TestHeader(props){
    return(
        <div>
            <div className="item-shadow">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="d-flex align-items-center">
                            <CgMenuLeftAlt size="28" color={PRIMARY_DARK} className="m-3" />
                            <div>
                                <h3 className="m-0 mt-bold">{props.testName}</h3>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex align-items-center">
                            <CgMenuLeftAlt size="28" color={PRIMARY_DARK} className="m-3" />
                            <IoIosHelpCircle size="28" color={PRIMARY_DARK} className="m-3" />
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                
            `}</style>
        </div>
    )
}