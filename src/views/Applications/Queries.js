import {gql} from 'apollo-boost';

export const GET_APPLICATIONS = gql`
    query getApplications{
        applications {
            id
            name
            lastName
            phone
            email
            englishLevel
            url
            createdAt
            applicationSkill{
                id
                isMain
                createdAt
                skill{
                    id
                    name
                    description
                    createdAt
                }
            }
        }
    }
`;