import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { Table, Button } from 'react-bootstrap';

const AuthorList = ({ authors }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Image</th>
          <th>Nom</th>
          <th>Domaine public</th>
        </tr>
      </thead>
      <tbody>
        {authors.map(author => (
          <tr key={author.eid}>
            <td>
              {author.img && <img src={author.img} alt={author.name} height="50px" />}
            </td>
            <td>{author.title}</td>
            <td>{author.publicDomain ? (
                    <Button variant="success">Domaine public</Button>
                    ) : (
                    <Button variant="secondary">Droits d'auteur</Button>
                    )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default AuthorList;
