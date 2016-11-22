class TimersDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timers: [
                {
                    title: 'Practice squat',
                    project: 'Gym Chroes',
                    id: uuid.v4(),
                    elapsed: 5456099,
                    runningSince: Date.now(),
                    editFormOpen: false,
                },
                {
                    title: 'Bake squash',
                    project: 'Kitchen Chores',
                    id: uuid.v4(),
                    elapsed: 1273998,
                    runningSince: null,
                },
            ],
        };

        this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
        this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
        this.handleTrashClick = this.handleTrashClick.bind(this);
        this.handleStartClick = this.handleStartClick.bind(this);
        this.handleStopClick = this.handleStopClick.bind(this);
    };

    handleCreateFormSubmit(timer) {
        this.createTimer(timer);
    };

    handleEditFormSubmit(attrs) {
        this.updateTimer(attrs);
    };

    handleTrashClick(timerId) {
        this.deleteTimer(timerId);
    };

    handleStartClick(timerId) {
        this.startTimer(timerId);
    };

    handleStopClick(timerId) {
        this.stopTimer(timerId);
    };

    createTimer(timer) {
        const t = helpers.newTimer(timer);
        // @TODO: rewrite setState to avoid concat
        this.setState({
            timers: [...this.state.timers, t],
        })
    };

    updateTimer(attrs) {
        this.setState({
            timers: this.state.timers.map(timer => (
                timer.id !== attrs.id ?
                    timer :
                    Object.assign({}, timer, {
                        title: attrs.title,
                        project: attrs.project,
                    })
            ))
        });
    };

    startTimer(timerId) {
        console.log('startTimer: ', timerId);
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map(timer => (
                timer.id !== timerId ?
                    timer :
                    Object.assign({}, timer, {
                        runningSince: now,
                    })
            ))
        });
    };

    stopTimer(timerId) {
        console.log('stopTimer: ', timerId);
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map(timer => {
                const lastElapsed = now - timer.runningSince;
                return (timer.id !== timerId ?
                    timer :
                    Object.assign({}, timer, {
                        elapsed: timer.elapsed + lastElapsed,
                        runningSince: null,
                    }))
            })
        });
    };

    deleteTimer(timerId) {
        this.setState({
            timers: this.state.timers.filter(timer => timer.id !== timerId),
        })
    };

    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onTrashClick={this.handleTrashClick}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit}
                        isOpen={true}
                    />
                </div>
            </div>
        );
    };
}

function EditableTimerList(props) {
    const timers = props.timers.map(timer => (
        <EditableTimer
            key={timer.id}
            id={timer.id}
            title={timer.title}
            project={timer.project}
            elapsed={timer.elapsed}
            runningSince={timer.runningSince}
            onFormSubmit={props.onFormSubmit}
            onTrashClick={props.onTrashClick}
            onStartClick={props.onStartClick}
            onStopClick={props.onStopClick}
        />
    ));
    return (
        <div id='timers'>
            {timers}
        </div>
    );
}

class EditableTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editFormOpen: false,
        };

        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleEditClick() {
        this.openForm();
    };

    handleFormClose() {
        this.closeForm();
    };

    handleSubmit(timer) {
        this.props.onFormSubmit(timer);
        this.closeForm();
    };

    closeForm() {
        this.setState({ editFormOpen: false });
    };

    openForm() {
        this.setState({ editFormOpen: true });
    };

    render() {
        if (this.state.editFormOpen) {
            return (
                <TimerForm
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    onFormSubmit={this.handleSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <Timer
                    id={this.props.id}
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                    onEditClick={this.handleEditClick}
                    onTrashClick={this.props.onTrashClick}
                    onStartClick={this.props.onStartClick}
                    onStopClick={this.props.onStopClick}
                />
            );
        }
    };
}

function TimerForm(props) {
    const submitText = props.id ? 'Update' : 'Create';
    // we can't use this.refs since we are in a functionnal component, create null variable to store the refs
    let title = null;
    let project = null;

    function handleSubmit() {
        props.onFormSubmit({
            id: props.id,
            title: title.value,
            project: project.value,
        });
    }

    return (
        <div className="ui centered card">
            <div className="ui form">
                <div className="field">
                    <label>Title</label>
                    <input type="text" ref={input => title = input} defaultValue={props.title} />
                </div>
                <div className="field">
                    <label>Project</label>
                    <input type="text" ref={input => project = input} defaultValue={props.project} />
                </div>
                <div className="ui two bottom attached buttons">
                    <button className="ui basic blue button" onClick={handleSubmit}>{submitText}</button>
                    <button className="ui basic red button" onClick={props.onFormClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

class ToggleableTimerForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen: false,
        };

        this.handleFormOpen = this.handleFormOpen.bind(this);
        this.handleFormClose = this.handleFormClose.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    };

    handleFormOpen() {
        this.setState({ isOpen: true });
    };

    handleFormClose() {
        this.setState({ isOpen: false });
    };

    handleFormSubmit(timer) {
        this.props.onFormSubmit(timer);
        this.setState({ isOpen: false });
    }

    render() {
        if (this.state.isOpen) {
            return (
                <TimerForm
                    onFormSubmit={this.handleFormSubmit}
                    onFormClose={this.handleFormClose}
                />
            );
        } else {
            return (
                <div className="ui basic content center aligned segment">
                    <button
                        className="=ui basic button icon"
                        onClick={this.handleFormOpen}
                    >
                        <i className="plus icon"></i>
                    </button>
                </div>
            );
        }
    };
}

class Timer extends React.Component {
    constructor(props) {
        super(props);

        this.handleStartClick = this.handleStartClick.bind(this);
        this.handleStopClick = this.handleStopClick.bind(this);
        this.handleTrashClick = this.handleTrashClick.bind(this);
    };

    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    };

    componentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
    };

    handleStartClick() {
        this.props.onStartClick(this.props.id);
    };

    handleStopClick() {
        this.props.onStopClick(this.props.id);
    };

     handleTrashClick() {
        this.props.onTrashClick(this.props.id);
    };

    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);
        return (
            <div className="ui centered card">
                <div className="content">
                    <div className="header">{this.props.title}</div>
                    <div className="meta">{this.props.project}</div>
                    <div className="center aligned description">
                        <h2>{elapsedString}</h2>
                    </div>
                    <div className="extra content">
                    <span className="right floated edit icon" onClick={this.props.onEditClick}>
                        <i className="edit icon"></i>
                    </span>
                        <span className="right floated trash icon" onClick={this.handleTrashClick}>
                        <i className="trash icon"></i>
                    </span>
                    </div>
                </div>
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>
        );
    }
}

function TimerActionButton(props) {
    if (props.timerIsRunning) {
        return (
            <div
                className="ui bottom attached red basic button"
                onClick={props.onStopClick}
            >
                Stop
            </div>
        );
    } else {
        return (
            <div
                className="ui bottom attached green basic button"
                onClick={props.onStartClick}
            >
                Start
            </div>
        );
    }
};

ReactDOM.render(
    <TimersDashboard/>,
    document.getElementById('content')
);
