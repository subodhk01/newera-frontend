import React from 'react'
import Link from 'next/link'
import SideBarLayout from '../components/UI/WithSideBar'
import { Empty } from 'antd'
import { useAuth } from '../utils/auth'
import { axiosInstance } from '../utils/axios'
import { customStyles2 } from '../utils/constants'
import Modal from 'react-modal'
import AuthHOC from '../components/AuthHOC'
import TeacherMaterialTable from '../components/Tables/Material/TeacherMaterialTable'

export default function StudyMaterials(props){
    const { profile, accessToken } = useAuth()

    const [ loading, setLoading ] = React.useState(true)
    const [ series, setSeries ] = React.useState()
    const [ materials, setMaterials ] = React.useState()
    React.useEffect(() => {
        props.setHeader(true)
        axiosInstance
            .get("/studymaterials/user")
            .then((response) => {
                console.log("studymaterials: ", response.data)
                setSeries(response.data)
                setLoading(false)
            }).catch((error) => {
                console.log(error)
            })
        console.log(profile)
        if(profile && profile.is_teacher){
            axiosInstance
                .get("/materials")
                .then((response) => {
                    console.log("materials: ", response.data)
                    setMaterials(response.data)
                    setLoading(false)
                }).catch((error) => {
                    console.log(error)
                })
        }
    }, [])
    const [ open, setOpen ] = React.useState(false)
    const [ activeId, setActiveId ] = React.useState()
    const [ deleting, setDeleting ] = React.useState(false)
    const deleteTest = (id) => {
        setActiveId(id)
        setOpen(true)
    }
    const confirmDelete = () => {
        setDeleting(true)
        axiosInstance
            .delete(`/materials/${activeId}`)
            .then((response) => {
                console.log("material delete response: ", response.data)
                window.location.reload()
            }).catch((error) => {
                console.log(error)
            })
    }
    return(
        <AuthHOC>
            <SideBarLayout title="Study Materials">
                <div className="p-2 p-md-5">
                    <div>
                        <h1>{profile.is_student && "My "}Study Materials</h1>
                    </div>
                    <div className="pt-3">
                        {profile.is_teacher && 
                            <div className="py-3 text-right">
                                <Link href="/studymaterials/create">
                                    <a>
                                        <div className="btn btn-success">
                                            Create New Study Material
                                        </div>
                                    </a>
                                </Link>
                                <Link href="/material/create">
                                    <a>
                                        <div className="btn btn-info">
                                            Create New Material
                                        </div>
                                    </a>
                                </Link>
                            </div>
                        }
                        <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                            
                            {loading ?
                                <>
                                    Loading...
                                </>
                                :
                                <>
                                    {series && series.length ? series.map((item, index) => {
                                            if(item.registered_students.includes(profile.id) || profile.is_teacher){
                                                return (
                                                    <div className="item-shadow p-3 py-4 m-3 cursor-pointer border" key={index}>
                                                        <h4>{item.name}</h4>
                                                        <div>
                                                            {item.materials.length} Materials
                                                        </div>
                                                        <hr />
                                                        <Link href={`/studymaterials/${item.id}`}>
                                                            <div className="btn btn-info">
                                                                Open
                                                            </div>
                                                        </Link>
                                                        {profile.is_teacher && 
                                                            <Link href={`/studymaterials/edit/${item.id}`}>
                                                                <div className="btn btn-warning">
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                        }
                                                    </div>
                                                )
                                            }
                                        })
                                        :
                                        profile.is_teacher ? <Empty description={<span>No Study Materials created yet</span>} /> : <Empty description={<span>Not Purchased any Study Material yet</span>} />
                                    }
                                </>
                            }
                        </div>
                        <hr />
                        {loading ?
                            "Loading..."
                        :
                            <div>
                                {profile.is_teacher && materials && materials.length ? <TeacherMaterialTable materials={materials} deleteTest={deleteTest} />
                                    :
                                    <Empty description={<span>No Materials Created</span>} />
                                }
                            </div>
                        }
                    </div>
                    <Modal
                        isOpen={open}
                        onRequestClose={() => setOpen(false)}
                        style={customStyles2}
                        contentLabel="Example Modal"
                        ariaHideApp={false}
                        shouldCloseOnOverlayClick={false}
                    >
                        <div className="text-center">
                            {!deleting ?
                                <div>
                                    <div className="mb-3">
                                        Confirm Delete Material
                                    </div>
                                    <div className="btn btn-danger" onClick={confirmDelete}>
                                        Delete Material
                                    </div>
                                    <div className="btn btn-warning" onClick={() => setOpen(false)}>
                                        Cancel
                                    </div>
                                </div>
                                :
                                <div>
                                    Deleting Material...
                                </div>
                            }
                        </div>
                    </Modal>
                </div>
                <style jsx>{`
                    .item-shadow {
                        color: grey;
                        min-width: 280px;
                    }
                `}</style>
            </SideBarLayout>
        </AuthHOC>
    )
}