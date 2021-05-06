import React from 'react';
import Button from 'react-bootstrap/Button'
import CardDeck from 'react-bootstrap/CardDeck'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import uniqueRandom from 'unique-random';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      balance: 100,
      diff: '',
      color: '',
      checked: '',
      images: [],
      end: false,
      data: {
        turns: 0,
        faces: [],
        investments: [],
        balances: []
      }
    }
    this.load = this.load.bind(this);
    this.end = this.end.bind(this);
    this.amount = React.createRef();
  }

  load(e) {
    e.preventDefault();
    const amount = this.amount.current.value;
    document.getElementById("balance").style.color = 'white';

    if (!this.state.playing) this.setState({ playing: true, end: false, balance: 100, diff: '', checked: '', images: '', data: {turns: 0, faces: [], investments: [], balances: [] }});
    else {
      if (amount % 1 !== 0 || amount < 1 || amount > this.state.balance) {
        alert("Invalid Amount");
        return;
      }
      if (this.state.checked === '') {
        alert("No Face Selected");
        return;
      }

      this.amount.current.value = '';
      document.getElementById(this.state.checked).checked = false;

      const success = Math.random() <= this.state.images[parseInt(this.state.checked)] / 10;

      if (success) {
        const profit = Math.round(1 + (1 - this.state.images[parseInt(this.state.checked)] / 10) * amount);
        this.setState({ balance: this.state.balance + profit, diff: 'You Gained $' + profit, color: 'lime' }, () => {
          this.state.data.balances.push(this.state.balance);
        });
      }
      else {
        this.setState({ balance: this.state.balance - amount, diff: 'You Lost $' + amount, color: 'red' }, () => {
          this.state.data.balances.push(this.state.balance);
          if (this.state.balance <= 0) {
            this.end(e);
          }
        });

      }
      this.setState({data: {turns : this.state.data.turns + 1, faces : this.state.data.faces, investments : this.state.data.investments, balances: this.state.data.balances}});
      this.state.data.faces.push(this.state.images[parseInt(this.state.checked)]);
      this.state.data.investments.push(amount);
    }

    const imgs = [];
    const random = uniqueRandom(0, 10);
    while (imgs.length < 5) {
      const img = random();
      if (!imgs.includes(img)) imgs.push(img);
    }

    this.setState({ images: imgs, checked: '' })
  }

  end(e) {
    e.preventDefault();
    if (this.state.checked !== '') document.getElementById(this.state.checked).checked = false;
    this.amount.current.value = '';
    this.setState({ playing: false, end: true, checked: '', images: '', diff: ''});
    document.getElementById("balance").style.color = this.state.balance >= 100 ? "lime" : "red";

    fetch("data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.data)
    })

  }

  render() {
    return (
      <React.Fragment>

        <p id="header">Face Game</p>

        <h1 id="balance" style={{ display: this.state.playing || this.state.end ? 'inline' : 'none'}}>{this.state.end ? "Final" : "Current"} Balance : ${this.state.balance}<br /></h1>

        <h2 style={{ display: this.state.diff === '' ? 'none' : 'inline', color: this.state.color }}>{this.state.diff}<br /></h2>

        <h3 style={{ display: this.state.end ? 'inline' : 'none', color: "yellow"}}>You Invested {this.state.data.turns} {this.state.data.turns === 1 ? "Time" : "Times"}<br /><br/></h3>

        <Button variant="primary" size="lg" onClick={this.load} style={{ display: this.state.playing ? 'none' : 'inline' }}>{this.state.end ? "Play Again" : "Play"}</Button>

        <br />

        <CardDeck style={{ display: this.state.playing ? 'flex' : 'none' }}>

          <Card>
            <Card.Img variant="top" src={this.state.images[0] + ".jpg"} />
            <Form.Check id="0" type="radio" name="face" onClick={() => this.setState({ checked: '0' })} />
          </Card>

          <Card>
            <Card.Img variant="top" src={this.state.images[1] + ".jpg"} />
            <Form.Check id="1" type="radio" name="face" onClick={() => this.setState({ checked: '1' })} />
          </Card>

          <Card>
            <Card.Img variant="top" src={this.state.images[2] + ".jpg"} />
            <Form.Check id="2" type="radio" name="face" onClick={() => this.setState({ checked: '2' })} />
          </Card>

          <Card>
            <Card.Img variant="top" src={this.state.images[3] + ".jpg"} />
            <Form.Check id="3" type="radio" name="face" onClick={() => this.setState({ checked: '3' })} />
          </Card>

          <Card>
            <Card.Img variant="top" src={this.state.images[4] + ".jpg"} />
            <Form.Check id="4" type="radio" name="face" onClick={() => this.setState({ checked: '4' })} />
          </Card>

        </CardDeck>

        <br />

        <Form id="form" style={{ display: this.state.playing ? 'flex' : 'none' }}>
          <Form.Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                <Form.Control ref={this.amount} placeholder="Enter Amount" />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button variant="success" onClick={this.load} type="submit">Invest</Button>
            </Col>
            <Col>
              <Button variant="primary" onClick={this.end} type="button">End Game</Button>
            </Col>
          </Form.Row>
        </Form>

      </React.Fragment>
    );
  }
}

export default App;
