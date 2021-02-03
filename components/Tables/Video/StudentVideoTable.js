import React from 'react'
import { Table, Empty } from 'antd';
import Router from 'next/router';


export default function StudentTestTable(props) {
	const [ loading, setLoading ] = React.useState(false)
	// const [ insideLoading, setInsideLoading ] = React.useState(true)
	// const [ insideError, setInsideError ] = React.useState(false)
	// const [ data, setData ] = React.useState([])
	// const [ columns, setColumns ] = React.useState([])
	React.useEffect(() => {
		
	}, [props.tests])

	const columns = [
		{ title: 'VideoId', dataIndex: 'id', key: 'id' },
		{ title: 'Title', dataIndex: 'title', key: 'tilte' },
		{ title: 'Start Date', key: 'start_time', render: (video) => (new Date(video.start_time)).toLocaleDateString() },
	];

	const data = [];
	props.tests && props.tests.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			title: item.title,
			start_time: item.start_time,
			status: item.status,
		})
	})

	return (
		<>
			{!loading &&
				<Table
					className="components-table-demo-nested"
					columns={columns}
					dataSource={data}
					locale={{
						emptyText: 
							<Empty description={<span>Not enrolled in any lectures yet</span>}>
								<div className="btn btn-info font-08 mb-4" onClick={() => Router.push('/lectureseries')}>View all Test Series</div>
							</Empty>
					}}
				/>
			}
		</>
	);
}