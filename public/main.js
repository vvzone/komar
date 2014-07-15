/** @jsx React.DOM */


React.renderComponent(
    <CatScreen cat="base"/>,
    document.getElementById('left_panel')
);


React.renderComponent(
    <MainWindow />,
    document.getElementById('main_window')
);