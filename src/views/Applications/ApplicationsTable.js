import React, { Fragment, useState } from 'react';
import moment from 'moment';
import {
    Card,
    CardBody,
    Row,
    Col,
    Button,
    Table,
    Progress,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';

const levelCalculate = (val) => {
    return (val/5) * 100;
}

const downloadAttachment = url => {
    return url && window.open(url, '_blank');
}

const rowGenerator = (data) => {
    const {name, lastName, englishLevel, url, createdAt, mainSkills} = data;
    const fullName = `${name} ${lastName}`;
    const percentLevel = englishLevel ? levelCalculate(englishLevel) : 0;
    const skills = mainSkills || [];
    const applicationDate = moment(Number.parseInt(createdAt)).format('L');
    return (
        <tr key={data.id}>
            <td>{fullName}</td>
            <td>{skills.map(s => s.name).join(', ')}</td>
            <td>
                <div className="clearfix">
                    <div className="float-left">
                        <strong>{percentLevel}%</strong>
                    </div>
                </div>
                <Progress className="progress-xs" color="info" value={percentLevel} />
            </td>
            <td>
                <Button color="primary" size="sm" onClick={_ => downloadAttachment(url)}>Download <i className="icon-cloud-download"></i></Button>
            </td>
            <td>{applicationDate}</td>
        </tr>
    )
}

const formatData = (data) => {
    const {applicationSkill, ...restData} = data;
    const mainSkills = applicationSkill.filter(as => as.isMain && as.skill).map(as => {
        return {id: as.id, name: as.skill.name, description: as.skill.description}
    });

    return {...restData, mainSkills}
}

const handleSearchChange = (e, setSearch) => {
    setSearch(e.currentTarget.value);
}

const handleFilter = (search, data) => {
    const text = search ? search.toLowerCase() : null;
    return text ? data.filter(d => d.name.toLowerCase().indexOf(text) > -1 || d.lastName.toLowerCase().indexOf(text) > -1) : data;
}

const showLoading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

const ApplicationsTable = props => {
    const [search, setSearch] = useState(null);

    if (props.loading) {
        return showLoading();
    }
    
    if (props.error) {
        return (<p>{`Error :( ${props.error}`}</p>)
    }

    // Aplicando filtro
    const dataTable = handleFilter(search, props.data);
    
    return (
        <Fragment>
            <Row className="mb-3">
                <Col md="4" lg="5">
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="search" name="search" onChange={(e) => handleSearchChange(e, setSearch)} placeholder="Search"/>
                    </InputGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardBody className="mt-3">
                            <Table hover responsive >
                                <thead className="thead-light">
                                    <tr>
                                        <th>FullName</th>
                                        <th>Main Skills</th>
                                        <th>English Level</th>
                                        <th>Attachment</th>
                                        <th>Application Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataTable.map(d => {
                                            const dataF = formatData(d);
                                            return rowGenerator(dataF)
                                        })
                                    }
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default ApplicationsTable;