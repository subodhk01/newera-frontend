import React from 'react'
import Link from 'next/link'
import { Table, Badge, Menu, Dropdown, Space, Empty, Alert } from 'antd';
import { TEST_STATUS } from '../../../utils/constants';
import Router from 'next/router';


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
		console.log(row)
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
					<Space direction="vertical">
						{TEST_STATUS[row.status] === "LIVE" && !row.instant_result && <Alert className="py-2" description="Results will be available after test ends" />}
						<div>
							<Link href={`/test/review/${attempt.key}`}>
								<a>
									<button className="btn btn-warning font-08" disabled={TEST_STATUS[row.status] === "LIVE" && !row.instant_result}>
										Review Test
									</button>
								</a>
							</Link>
							<Link href={`/result/${attempt.key}`}>
								<a>
									<button className="btn btn-warning font-08" disabled={TEST_STATUS[row.status] === "LIVE" && !row.instant_result}>
										View Result
									</button>
								</a>
							</Link>
						</div>
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
		{ title: 'Status', key: 'status', render: (test) => TEST_STATUS[test.status] },
		{ title: 'Duration', dataIndex: 'duration', key: 'duration' },
		{ title: 'Action', key: 'operation', render: (test) => 
			<Link href={`/test/attempt/${test.id}`}>
				<a>
					{test.status < 1 ? 
						<div>Test not yet started</div> 
						: 
						<button className="btn btn-info">
							Start Test
						</button>
					}
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
			duration: item.time_alotted,
			status: item.status,
			instant_result: item.instant_result
		})
	})

	return (
		<>
			{!loading &&
				<Table
					className="components-table-demo-nested"
					columns={columns}
					expandable={{ expandedRowRender }}
					dataSource={data}
					locale={{
						emptyText: 
							<Empty description={<span>Not enrolled in any tests yet</span>}>
								<div className="btn btn-info font-08 mb-4" onClick={() => Router.push('/testseries')}>View all Test Series</div>
							</Empty>
					}}
				/>
			}
		</>
	);
}