String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

String.prototype.removeDuplicates = function () {
	return [...new Set(this.valueOf().split(''))].join('');
}

String.prototype.hasDuplicates = function () {
	return this.valueOf().length !== this.valueOf().removeDuplicates().length;
}
