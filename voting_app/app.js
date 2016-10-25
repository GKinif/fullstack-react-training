class ProductList extends React.Component {
    constructor() {
        super();
        this.state = {products: []};
        this.handleProductUpVote = this.handleProductUpVote.bind(this);
    };

    componentDidMount() {
        this.updateState();
    };

    updateState() {
        const products = Data.sort((a, b) => b.votes - a.votes);
        this.setState({ products });
    };

    handleProductUpVote(productId, incValue) {
        let product = Data.find(curr => curr.id === productId);
        product.votes = product.votes + incValue;
        this.updateState();
    };

    render() {
        const products = this.state.products.map(product => (
            <Product
                key={`product-${product.id}`}
                id={product.id}
                title={product.title}
                description={product.description}
                url={product.url}
                votes={product.votes}
                submitter_avatar_url={product.submitter_avatar_url}
                product_image_url={product.product_image_url}
                onVote={this.handleProductUpVote}
            />
        ));
        return (
            <div className='ui items'>
                {products}
            </div>
        );
    };
};

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpVote = this.handleUpVote.bind(this);
        this.handleDownVote = this.handleDownVote.bind(this);
    };

    handleUpVote() {
        this.props.onVote(this.props.id, 1);
    };

    handleDownVote() {
        this.props.onVote(this.props.id, -1);
    }

    render() {
        return (
            <div className='item'>
                <div className='image'>
                    <img src={this.props.product_image_url} />
                </div>
                <div className='middle aligned content'>
                    <div className='header'>
                        <a onClick={this.handleUpVote}>
                            <i className='large caret up icon'></i>
                        </a>
                        {this.props.votes}
                        <a onClick={this.handleDownVote}>
                            <i className='large caret down icon'></i>
                        </a>
                    </div>
                    <div className='description'>
                        <a href={this.props.url}>{this.props.title}</a>
                    </div>
                    <div className='extra'>
                        <span>Submitted by: </span>
                        <img
                            className='ui avatar image'
                            src={this.props.submitter_avatar_url}
                        />
                    </div>
                </div>
            </div>
        );
    };
};

ReactDOM.render(
    <ProductList />,
    document.getElementById('content')
)