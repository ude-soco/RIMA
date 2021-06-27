import React, { Component } from "react";
import "./style.css";
import { Stage, Layer, Rect, Text, Circle, Line } from "react-konva";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import RestAPI from "Services/api";

import { handleServerErrors } from "Services/utils/errorHandler";
import {Grid} from "@material-ui/core";

class ConceptMapContainer extends Component {
	constructor(props) {
		super(props);
		this.getsimilartweets = this.getsimilartweets.bind(this); //**created by mouadh */


		this.stageHeight = 1200;
		this.stageWidth = 900;

		this.keywordNodeSize = 20;
		this.keywordNodeSpacing = 30;
		this.KeywordNodeX = 150;

		this.categoryNodeHeight = 30;
		this.categoryNodeWidth = 200;
		this.categoryNodeSpacing = 20;
		this.categoryNodeX = this.stageWidth - this.categoryNodeWidth - 150;

		this.lineColor = "#9ccdec";
		this.rectStrokeColor = "black";
		this.rectFillColor = "#185a9d";
		this.circleStrokeColor = "black";
		this.circleFillColor = "#bcbec0";

		this.highlightColor = "#ffe47a";

		this.textFontFamily =
			'-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif';

		this.state = {
			data: [],
			isLoading: true,
			isData: true,
			score: [], //**created by mouadh */
		};
	}

	toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	componentDidMount() {
		this.setState({ isLoding: true }, () => {
			RestAPI.conceptChart()
				.then((response) => {
					console.log(response);
					if (response.data.length === 0) {
						this.setState({
							isData: false,
						});
					}
					let chartData = [];
					let dataLength = Math.min(response.data.length, 5);
					for (let index = 0; index < dataLength; index++) {
						chartData.push({
							keyword: response.data[index].keyword,
							rank: response.data[index].weight,
							source: response.data[index].source,
							category: response.data[index].categories.map(
								(item) => item.name
							),
						});
					}
					this.setState(
						{
							isLoding: false,
							data: chartData,
						},
						this.extractNodes
					);
				})
				.catch((error) => {
					this.setState({ isLoding: false });
					handleServerErrors(error, toast.error);
				});
		});
		this.getsimilartweets() //**added by mouadh */
	}

	

	getsimilartweets() { //**added by mouadh */

		fetch(
			"http://127.0.0.1:8000/api/interests/getsimilarity/"
		)
			.then((response) => response.json())
			.then((json) => {
				console.log('similarity score:', json)
				this.setState({})
			}
		)
	}
	//** */


	extractNodes = () => {
		const { data } = this.state;
		let categories = {};
		let keywords = {};
		let links = {};
		for (let index = 0; index < data.length; index++) {
			const keyword = data[index].keyword;
			const keywordCategories = data[index].category;
			keywords[keyword] = {};
			links[keyword] = keywordCategories;
			for (
				let categoryIndex = 0;
				categoryIndex < keywordCategories.length;
				categoryIndex++
			) {
				categories[keywordCategories[categoryIndex]] = {};
			}
		}
		this.setState({ keywords, categories, links }, this.generateCoordinates);
	};

	generateCoordinates = () => {
		const { keywords, categories } = this.state;

		const totalKeywords = Object.keys(keywords).length;
		const KeywordBlockTotalSize =
			totalKeywords * (this.keywordNodeSpacing + this.keywordNodeSize);
		const keywordStartOffset = parseInt(
			(this.stageHeight - KeywordBlockTotalSize) / 2
		);

		let keywordCount = 0;
		for (let keyword in keywords) {
			let y =
				keywordStartOffset +
				parseInt(this.keywordNodeSpacing / 2) +
				keywordCount *
				(parseInt(this.keywordNodeSpacing / 2) + this.keywordNodeSize);
			keywordCount += 1;
			keywords[keyword].x = this.KeywordNodeX;
			keywords[keyword].y = y;
		}

		const totalCategories = Object.keys(categories).length;
		const categoriesBlockTotalSize =
			totalCategories * (this.categoryNodeSpacing + this.categoryNodeHeight);

		const categoriesStartOffset = parseInt(
			(this.stageHeight - categoriesBlockTotalSize) / 2
		);

		let categoryCount = 0;
		for (let category in categories) {
			let y =
				categoriesStartOffset +
				parseInt(this.categoryNodeSpacing / 2) +
				categoryCount *
				(parseInt(this.categoryNodeSpacing / 2) + this.categoryNodeHeight);
			categoryCount += 1;
			categories[category].x = this.categoryNodeX;
			categories[category].y = y + 50;
		}

		this.setState({ keywords, categories });
	};

	getNodes = () => {
		const { keywords, categories, links } = this.state;
		let nodes = [];

		for (let keywordKey in links) {
			const keywordLink = links[keywordKey];
			const keyword = keywords[keywordKey];
			for (let index in keywordLink) {
				const category = categories[keywordLink[index]];
				nodes.push(
					<Line
						points={[
							keyword.x,
							keyword.y,
							category.x,
							category.y + parseInt(this.categoryNodeHeight / 2),
						]}
						tension={500}
						stroke={
							keyword.highlight && category.highlight
								? this.highlightColor
								: this.lineColor
						}
					/>
				);
			}
		}

		for (let keyword in keywords) {
			nodes.push(
				<Circle
					key={keyword + "circle"}
					x={keywords[keyword].x}
					y={keywords[keyword].y}
					radius={10}
					fill={this.circleFillColor}
					strokeWidth="3"
					onMouseOver={(e) => this.mouseOverEvent(e, "keyword", keyword)}
					onMouseOut={(e) => this.mouseOutEvent(e, "keyword", keyword)}
					stroke={
						keywords[keyword].highlight
							? this.highlightColor
							: this.circleFillColor
					}
				/>
			);
			nodes.push(
				<Text
					key={keyword + "text"}
					x={10}
					y={keywords[keyword].y - 5}
					text={this.toTitleCase(keyword)}
					fontFamily={this.textFontFamily}
				/>
			);
		}

		for (let category in categories) {
			nodes.push(
				<Rect
					key={category + "rect"}
					x={categories[category].x}
					y={categories[category].y}
					height={this.categoryNodeHeight}
					width={this.categoryNodeWidth}
					cornerRadius={10}
					fill={this.rectFillColor}
					onMouseOver={(e) => this.mouseOverEvent(e, "category", category)}
					onMouseOut={(e) => this.mouseOutEvent(e, "category", category)}
					strokeWidth="3"
					stroke={
						categories[category].highlight
							? this.highlightColor
							: this.rectFillColor
					}
				/>
			);
			// add ellipsis to text after 10 chars
			let categoryText =
				category.length > 35 ? category.slice(0, 35) + "..." : category;
			nodes.push(
				<Text
					key={category + "text"}
					x={categories[category].x + 10}
					y={categories[category].y + 10}
					onMouseOver={(e) => this.mouseOverEvent(e, "category", category)}
					onMouseOut={(e) => this.mouseOutEvent(e, "category", category)}
					text={categoryText}
					fontFamily={this.textFontFamily}
					stroke="white"
					strokeWidth="1"
				/>
			);
		}
		return nodes;
	};

	mouseOverEvent = (event, nodeType, nodeKey) => {
		const stage = event.target.getStage();
		const container = stage.container();
		container.style.cursor = "pointer";

		let { categories, keywords, links } = this.state;
		if (nodeType === "keyword") {
			keywords[nodeKey].highlight = true;
			let categoryKeys = links[nodeKey];

			for (let index in categoryKeys) {
				categories[categoryKeys[index]].highlight = true;
			}
		}

		if (nodeType === "category") {
			categories[nodeKey].highlight = true;

			for (let keyword in links) {
				if (links[keyword].indexOf(nodeKey) > -1) {
					keywords[keyword].highlight = true;
				}
			}
		}

		this.setState({ categories, keywords });
	};

	mouseOutEvent = (event) => {
		const container = event.target.getStage().container();
		container.style.cursor = "default";

		let { categories, keywords } = this.state;
		for (let category in categories) {
			categories[category].highlight = false;
		}

		for (let keyword in keywords) {
			keywords[keyword].highlight = false;
		}

		this.setState({ categories, keywords });
	};

	render() {
		const containerDiv = document.querySelectorAll(".card-body")[0];
		// const width = containerDiv ? containerDiv.clientWidth : this.stageWidth;
		const width = this.stageWidth;
		const { categories } = this.state;
		let highlighedCategory = [];
		if (categories) {
			highlighedCategory = Object.keys(categories).filter(
				(item) => categories[item].highlight
			);
		}

		return (
			<>
				<div id="conceptMapWrapper">
					{this.state.isLoding ? (
						<div className="text-center" style={{ padding: "20px" }}>
							<Loader type="Puff" color="#00BFFF" height={100} width={100} />
						</div>
					) : this.state.isData ? (
						<>
							<Grid container justify="center">
								<Grid item>
									<Stage
										width={width} height={this.stageHeight}
									>
										<Layer>{this.getNodes()}</Layer>
									</Stage>
								</Grid>
							</Grid>
						</>
					) : (
								<div style={{ textAlign: "center" }}>
									No data is available at the moment
								</div>
							)}
				</div>
			</>
		);
	}
}

export default ConceptMapContainer;
