var React = require('react');
var d3    = require('d3');


function position() {
    this.style('left',   d => { return d.x + 'px';                   })
        .style('top',    d => { return d.y + 'px';                   })
        .style('width',  d => { return Math.max(0, d.dx - 1) + 'px'; })
        .style('height', d => { return Math.max(0, d.dy - 1) + 'px'; })
    ;
}


var Treemap = React.createClass({
    getDefaultProps() {
        return {
            transitionDuration: 800,
            showCount:          false
        };
    },

    propTypes: {
        showCount: React.PropTypes.bool.isRequired
    },

    d3Render(data) {
        if (!data) {
            return;
        }

        var el = this.getDOMNode();

        var width  = el.offsetWidth;
        var height = el.offsetHeight;

        var treemap = d3.layout.treemap()
            .size([width, height])
            .sticky(true)
            .value(d => d.count)
        ;

        var container = d3.select(el);

        var chunks = container.selectAll('.treemap__chunk')
            .data(treemap.nodes(data));

        var newChunks = chunks.enter().append('div')
            .attr('class', 'treemap__chunk')
            .call(position)
            .style('background', d => d.color)
            .append('span')
            .text(d => d.label)
        ;

        if (this.props.showCount === true) {
            newChunks.append('span')
                .attr('class', 'count')
                .text(d => d.count)
            ;
        }

        chunks
            .transition()
            .duration(this.props.transitionDuration)
            .call(position)
        ;
    },

    shouldComponentUpdate(data) {
        this.d3Render(data.data);

        return false;
    },

    render() {
        var style = {
            width:  '100%',
            height: '100%'
        };

        return <div className="treemap" style={style} />;
    }
});

module.exports = Treemap;