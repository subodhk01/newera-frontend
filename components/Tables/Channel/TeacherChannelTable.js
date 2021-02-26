import React from 'react'
import Link from 'next/link'
import { FaPencilAlt } from 'react-icons/fa'
import { Table, Empty } from 'antd';

export default function TeacherTestTable(props) {
	const [ loading, setLoading ] = React.useState(false)

	const columns = [
		{ title: 'ChannelId', dataIndex: 'id', key: 'id' },
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Action', key: 'operation', render: (channel) => 
			<>
				<Link href={`/channels/edit/${channel.id}`}>
					<a>
						<div className="btn btn-success ">
							<div className="d-flex align-items-center justify-content-center">
								<FaPencilAlt color="white" className="mr-2" /> Edit
							</div>
						</div>
					</a>
				</Link>
				<div className="btn btn-danger" onClick={() => props.deleteChannel(channel.id)}>
					<div className="d-flex align-items-center justify-content-center">Delete</div>
				</div>
			</>
		},
	];

	const data = [];
	props.channels && props.channels.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			name: item.name,
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
							<Empty description={<span>No Channels</span>} />
					}}
				/>
			}
		</>
	);
}