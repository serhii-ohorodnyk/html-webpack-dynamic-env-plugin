
fromFile=${1}
toFile=${2}

sed -e 's|%API_ENDPOINT%|"'${API_ENDPOINT-"https://api.github.com"}'"|g;s|%FEATURE_FLAG%|"'${FEATURE_FLAG-"true"}'"|g;' $fromFile > $toFile
