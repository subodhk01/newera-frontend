import React from 'react'
import Link from 'next/link'
import { Table, Badge, Menu, Dropdown, Space, Empty, Alert } from 'antd';
import { TEST_STATUS } from '../../../utils/constants';
import Router from 'next/router';


export default function TestResultTable(props) {
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
                    //console.log("attempt", attempt)
					return (
						<span>
							{attempt.practice ? <Badge status="warning" /> : <Badge status="success" />}
							{attempt.practice ? "Practise" : "Real"}
						</span>
					)
				},
			},
			{ 
				title: 'Marks', 
				dataIndex: 'marks', 
				key: 'marks',
				render: (marks) => (
					<span>{marks && marks.total}</span>
				)
            },
            { 
				title: 'Rank', 
				dataIndex: 'ranks', 
				key: 'ranks',
				render: (ranks) => (
					<span>{ranks && ranks.overall}</span>
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
        row.sessions.map((session, index) => { 
			data.push({
                key: session.id,
                practice: session.practice,
                marks: session.marks,
                ranks: session.ranks
            })
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
					</div>
				}
			</>	
		)
	};

	const columns = [
        { title: 'Student Name', dataIndex: 'name', key: 'name' },
        { title: 'Rank', dataIndex: 'rank', key: 'rank' },
		// { title: 'Action', key: 'operation', render: (student) => 
		// 	<div>
        //         {student.name}
        //     </div>
		// },
	];

	const data = [];
	Object.keys(props.students).map((item, index) => {
		data.push({
			key: item,
            name: item,
            rank: props.students[item].rank,
            sessions: props.students[item].sessions
		})
    })
    data.sort((x,y) => x.rank - y.rank)

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