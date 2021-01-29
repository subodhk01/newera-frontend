import React from 'react'
import Link from 'next/link'
import { FaPencilAlt } from 'react-icons/fa'
import { Table, Badge, Menu, Dropdown, Space, Empty } from 'antd';
import { TEST_STATUS } from '../../../utils/constants';


const menu = (
	<Menu>
		<Menu.Item>Action 1</Menu.Item>
		<Menu.Item>Action 2</Menu.Item>
	</Menu>
);

export default function TeacherTestTable(props) {
	const [ loading, setLoading ] = React.useState(false)
	// const [ insideLoading, setInsideLoading ] = React.useState(true)
	// const [ insideError, setInsideError ] = React.useState(false)
	// const [ data, setData ] = React.useState([])
	// const [ columns, setColumns ] = React.useState([])
	React.useEffect(() => {
		
	}, [props.videos])

	const columns = [
		{ title: 'VideoId', dataIndex: 'id', key: 'id' },
		{ title: 'Title', dataIndex: 'title', key: 'tilte' },
		{ title: 'Start Date', key: 'start_time', render: (video) => (new Date(video.start_time)).toLocaleDateString() },
		{ title: 'Action', key: 'operation', render: (video) => 
			<>
				<Link href={`/video/edit/${video.id}`}>
					<a>
						<div className="btn btn-success ">
							<div className="d-flex align-items-center justify-content-center">
								<FaPencilAlt color="white" className="mr-2" /> Edit
							</div>
						</div>
					</a>
				</Link>
				<div className="btn btn-danger" onClick={() => props.deleteTest(video.id)}>
					<div className="d-flex align-items-center justify-content-center">Delete</div>
				</div>
			</>
		},
	];

	const data = [];
	props.videos && props.videos.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			title: item.title,
			start_time: item.start_time,
		})
	})

	data.sort((x,y) =>  y.id - x.id)

	return (
		<>
			{!loading &&
				<Table
					className="components-table-demo-nested"
					columns={columns}
					//expandable={{ expandedRowRender }}
					dataSource={data}
					locale={{
						emptyText: 
							<Empty description={<span>No tests yet, create one from above</span>} />
					}}
				/>
			}
		</>
	);
}