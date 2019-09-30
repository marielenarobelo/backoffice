import React, {Fragment, useState, useEffect} from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import {
    Card, CardBody, Progress, Button, Row, Col, Input, InputGroup,
    InputGroupAddon, InputGroupText, Label
} from 'reactstrap';
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Truncate from 'react-truncate';

const LEVEL_ALL = 'All';
const LEVEL_MEDIUM = 'Medium';
const LEVEL_ADVANCED = 'Advanced';

const ENGLISH_LEVEL_OPTIOS = [
    {value: LEVEL_ALL, label: LEVEL_ALL},
    {value: LEVEL_MEDIUM, label: LEVEL_MEDIUM},
    {value: LEVEL_ADVANCED, label: LEVEL_ADVANCED}
];

const levelCalculate = val => ((val/5) * 100);
const downloadAttachment = url => url && window.open(url, '_blank');
const attachmentFormat = (cell, row) => <Button color="primary" size="sm" onClick={_ => downloadAttachment(cell)}>Download <i className="icon-cloud-download"></i></Button>;
const englishLevelFormat = (cell, row) => <Fragment>
                                            <div className="clearfix">
                                                <div className="float-left">
                                                    <strong>{cell}%</strong>
                                                </div>
                                            </div>
                                            <Progress className="progress-xs" color="info" value={cell} />
                                        </Fragment>;

const formatData = (data) => {
    const {name, lastName, applicationSkill, url, englishLevel, createdAt} = data;
    const percentLevel = englishLevel ? levelCalculate(englishLevel) : 0;
    let mainSkills = '', otherSkills = '';
    if(applicationSkill){
        mainSkills = applicationSkill.filter(as => as.skill && as.isMain).map(s => s.skill.name).join(', ');
        otherSkills = applicationSkill.filter(as => as.skill && !as.isMain).map(s => s.skill.name).join(', ');
    }

    return {
        fullName: `${name} ${lastName}`,
        mainSkills,
        otherSkills,
        englishLevel:percentLevel,
        applicationDate: moment(Number.parseInt(createdAt)).format('L'),
        attachment: url
    }

}

const getCaret = (direction) => {
    switch (direction) {
        case 'asc':
            return <span> <i className="fa fa-caret-up"></i></span>;
        case 'desc':
            return <span> <i className="fa fa-caret-down"></i></span>;
        default:
            return <span> <i className="fa fa-caret-up text-muted"></i><i className="fa fa-caret-down text-muted"></i></span>;        
    }
}

const handleFilter = (search, data, levelFilter) => {
    const text = search ? search.toLowerCase() : null;
    switch (levelFilter) {
        case LEVEL_MEDIUM:
                data = data.filter(d => d.englishLevel > 50 && d.englishLevel <= 80)
            break;
        case LEVEL_ADVANCED:
                data = data.filter(d => d.englishLevel > 81)
                break;
        default:
            break;
    }
    return text 
    ? data.filter(d => d.mainSkills.toLowerCase().includes(text) || d.otherSkills.toLowerCase().includes(text)) 
    : data;
}

const SkillsTruncate = ({children}) => {
    const [seeMore, setSeeMore] = useState(false);
    return <Fragment>
        <Truncate
            lines={!seeMore && 2}
            ellipsis={(<span>... <small><a href='#' onClick={_ => setSeeMore(true)}>See more</a></small></span>)}
        >
            {children}
        </Truncate>
        {seeMore && <small> <a href='#' onClick={_ => setSeeMore(false)}>See less</a></small>}
    </Fragment> 
    
}

const skillsFormat = (cell, row) => <div><SkillsTruncate>{cell}</SkillsTruncate></div>;

const ApplicationsTable = props => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState(null);
    const [levelFilter, setLevelFilter] = useState({value: LEVEL_ALL, label: LEVEL_ALL});

    // didReceiveProps
    useEffect(() => {
        setData(props.data.map(d => formatData(d)));
    }, [props.data]);

    const dataTable = handleFilter(search, data, levelFilter.value);

    const columns = [{
        dataField: 'fullName',
        text: 'FullName',
        sort: true,
        sortCaret: getCaret
      }, {
        dataField: 'mainSkills',
        text: 'Main Skills',
        sort: true,
        sortCaret: getCaret,
        formatter: skillsFormat
      }, {
        dataField: 'otherSkills',
        text: 'Other Skills',
        sort: true,
        sortCaret: getCaret
      }
      , {
        dataField: 'englishLevel',
        text: 'English Level',
        sort: true,
        sortCaret: getCaret,
        formatter: englishLevelFormat
      }
      , {
        dataField: 'applicationDate',
        text: 'Application Date',
        sort: true,
        sortCaret: getCaret
      }
      , {
        dataField: 'attachment',
        text: 'Attachment',
        formatter: attachmentFormat
      }
    ];

    const defaultSorted = [{
        dataField: 'applicationDate',
        order: 'desc'
    }];

    return <Fragment>
        <Card>
            <CardBody>
                <Row className="mb-3 d-flex align-items-end">
                    <Col md="4" lg="3">
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-search"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input type="text" id="search" name="search" onChange={(e) => setSearch(e.currentTarget.value)} placeholder="Skills Search"/>
                        </InputGroup>
                    </Col>

                    <Col md="4" lg="3">
                        <Label>English Level</Label>
                        <Select
                            options={ENGLISH_LEVEL_OPTIOS}
                            value={levelFilter}
                            onChange={setLevelFilter}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card>

        <Card>
            <CardBody>
                <BootstrapTable 
                    loading={props.loading}
                    keyField="fullName-applicationDate" 
                    data={ dataTable } 
                    columns={ columns } 
                    pagination={ paginationFactory() }
                    defaultSorted={ defaultSorted }
                    />
            </CardBody>
        </Card>
    </Fragment>
}

export default ApplicationsTable;