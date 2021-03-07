import React from 'react'
import Link from 'next/link'
import { Table, Empty } from 'antd';


export default function StudentChannelTable(props) {
	const [ loading, setLoading ] = React.useState(false)

	const columns = [
		{ title: 'ChannelId', dataIndex: 'id', key: 'id' },
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Action', key: 'operation', render: (channel) =>
				<>
					{props.teacher ?
						<div className="btn btn-success " onClick={() => props.onAskClick(channel.id)}>
							<div className="d-flex align-items-center justify-content-center">
								Ask Doubt
							</div>
						</div>
						:
						<Link href={`/channels/${channel.id}`}>
							<a>
								<div className="btn btn-success ">
									<div className="d-flex align-items-center justify-content-center">
										Open
									</div>
								</div>
							</a>
						</Link>
					}
				</>
		},
	];

	const data = [];
	props.channels && props.channels.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			name: item.name || (item.user && item.user.name),
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
							<Empty description={<span>Not enrolled in any Channels yet</span>}>
							
							</Empty>
					}}
				/>
			}
		</>
	);
}