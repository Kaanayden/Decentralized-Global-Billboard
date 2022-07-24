import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import MainHeader from '../../images/main-header.jpg'

function BasicExample({chosenDate}) {
  return (
      <Card style={{ width: '20rem' }}>
        <Card.Img style={{ width: '60%'}} variant="top" src={MainHeader} />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            {chosenDate.toString()}
          </Card.Text>
        </Card.Body>
      </Card>
  );
}

export default BasicExample;