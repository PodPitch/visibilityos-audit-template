#!/bin/sh
set -eu

package_source=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
package_output=${1:?Provide a new output directory}

mkdir -- "$package_output"
cp -- "$package_source/package.json" "$package_source/README.md" "$package_output/"
cp -- "$package_source/../dataset/engine-views.csv" "$package_source/../dataset/outcomes.csv" "$package_output/"
python3 "$package_source/../reproduce.py" --json > "$package_output/summary.json"
