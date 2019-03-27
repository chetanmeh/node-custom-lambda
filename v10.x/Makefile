
NODE_VERSION=10.15.3
REGION='us-east-1'
LAYER_NAME='customnodejs10'

.PHONY: build
build:
	docker build --build-arg NODE_VERSION=${NODE_VERSION} -t node-provided-lambda-v10.x .
	docker run --rm node-provided-lambda-v10.x cat "/tmp/node-v${NODE_VERSION}.zip" > ./layer.zip

.PHONY: publish
publish:
	aws lambda publish-layer-version --region ${REGION} --layer-name ${LAYER_NAME} \
	--zip-file fileb://layer.zip --cli-read-timeout 0 --cli-connect-timeout 0 \
	--description "Node.js v${NODE_VERSION} custom runtime" --query Version --output text

.PHONY: test-zip
test-zip:
	cd test && npm install && rm -f lambda.zip && zip -qyr lambda.zip index.js node_modules

.PHONY: test-update
test-update: test-zip
	aws lambda update-function-code --function-name hello-world-custom-1 --zip-file fileb://test/lambda.zip --publish