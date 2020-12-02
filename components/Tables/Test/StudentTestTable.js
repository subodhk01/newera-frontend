import React from 'react'
import Link from 'next/link'
import { Table, Badge, Menu, Dropdown, Space } from 'antd';
import { TEST_STATUS } from '../../../utils/constants';


const menu = (
	<Menu>
		<Menu.Item>Action 1</Menu.Item>
		<Menu.Item>Action 2</Menu.Item>
	</Menu>
);

export default function StudentTestTable(props) {
	const [ loading, setLoading ] = React.useState(false)
	// const [ insideLoading, setInsideLoading ] = React.useState(true)
	// const [ insideError, setInsideError ] = React.useState(false)
	// const [ data, setData ] = React.useState([])
	// const [ columns, setColumns ] = React.useState([])
	React.useEffect(() => {
		
	}, [props.tests])

	const expandedRowRender = (row) => {
		let data = [];
		const columns = [
			{
				title: 'Attempt',
				key: 'attempt',
				render: (attempt) => {
					return (
						<span>
							{attempt.practice ? <Badge status="warning" /> : <Badge status="success" />}
							{attempt.practice ? "Practise" : "Real"}
						</span>
					)
				},
			},
			{ 
				title: 'Start Time', 
				dataIndex: 'time', 
				key: 'time',
				render: (time) => (
					<span>{(new Date(time)).toLocaleString()}</span>
				)
			},
			{
				title: 'Action',
				//dataIndex: 'operation',
				key: 'operation',
				render: (attempt) => (
					<Space>
						<Link href={`/test/review/${attempt.key}`}>
							<a>
								<div className="btn btn-warning font-08">
								Review Test
								</div>
							</a>
						</Link>
						<Link href={`/result/${attempt.key}`}>
							<a>
								<div className="btn btn-warning font-08">
									View Result
								</div>
							</a>
						</Link>
					</Space>
				),
			},
		];
		props.sessions.map((session, index) => {
			if(session.test === row.id || (session.test && session.test.id) === row.id){
				data.push({
					key: session.id,
					practice: session.practice,
					time: session.checkin_time,
				})
			}
		})
		return(
			<>
				{data.length ? 
					<div className="w-75 mx-auto">
						<Table columns={columns} dataSource={data} pagination={false} />
					</div>
					:
					<div className="text-center">
						<p>No Attempts yet</p>
						<div>
							<Link href={`/test/attempt/${row.id}`}>
								<a>
									<div className="btn btn-primary">
										Attempt Test
									</div>
								</a>
							</Link>
							<Link href={`/test/attempt/${row.id}`}>
								<a>
									<div className="btn btn-warning">
										Practise Attempt
									</div>
								</a>
							</Link>
						</div>
					</div>
				}
			</>	
		)
	};

	const columns = [
		{ title: 'TestId', dataIndex: 'id', key: 'id' },
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Status', dataIndex: 'status', key: 'status' },
		{ title: 'Action', key: 'operation', render: (test) => 
			<Link href={`/test/attempt/${test.id}`}>
				<a>
					<div className="btn btn-info">
						Start Test
					</div>
				</a>
			</Link>
		},
	];

	const data = [];
	props.tests && props.tests.map((item, index) => {
		data.push({
			key: item.id,
			id: item.id,
			name: item.name,
			status: TEST_STATUS[item.status]
		})
	})

	data.sort((x,y) =>  y.id - x.id)

	return (
		<>
			{!loading &&
				<Table
					className="components-table-demo-nested"
					columns={columns}
					expandable={{ expandedRowRender }}
					dataSource={data}
				/>
			}
		</>
	);
}