package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"os"
	"strings"
)

func main() {
	file, err := os.Open("vocab.csv")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return
	}
	defer file.Close()

	reader := csv.NewReader(file)
	reader.Comma = ';'

	outputFile, err := os.Create("output.txt")
	if err != nil {
		fmt.Println("Error creating output file:", err)
		return
	}
	defer outputFile.Close()

	writer := bufio.NewWriter(outputFile)

	for rowIndex := 0; ; rowIndex++ {
		record, err := reader.Read()
		if err != nil {
			break // end of file
		}

		dutch := record[0]
		englishTranslations := strings.Split(record[1], ",")

		insertStatement := generateInsertStatement(rowIndex, dutch, englishTranslations)

		_, err = writer.WriteString(insertStatement + "\n")
		if err != nil {
			fmt.Println("Error writing to output file:", err)
			return
		}
	}

	writer.Flush()
}

func generateInsertStatement(id int, dutch string, englishTranslations []string) string {
	englishTranslationsArray := fmt.Sprintf("ARRAY['%s']::text[]", strings.Join(englishTranslations, "', '"))

	insertStatement := fmt.Sprintf(
		`INSERT INTO lang_cards."LanguageCard"
		(id, "englishTranslations", "allAttemptedAnswerCount", "correctAnswerCount", "createdAt", dutch)
		VALUES(%d, %s, 0, 0, CURRENT_TIMESTAMP, '%s');`,
		id, englishTranslationsArray, dutch)

	return insertStatement
}