section_selection_schema = {
    "type": "ARRAY",
    "items": {
        "type": "OBJECT",
        "properties": {
            "section": {"type": "STRING"},
            "page_range": {"type": "STRING"},
        },
        "required": ["section", "page_range"]
    }
}

toc_reading_prompt = """
You are an expert at selecting relevant sections from a document based on a user query and the document's Table of Contents (TOC).

<Query>
{query}
</Query>

<TOC>
{toc}
</TOC>

Select the sections from the TOC that are most relevant to answering the query.
Output a JSON list of the selected sections and their page ranges. Page range should include the starting page all the way up to the start of next section.
If no sections are relevant, output an empty list [].
"""

response = await client.aio.models.generate_content(
    model="gemini-3-pro-preview",
    contents=toc_reading_prompt.format(query=query, toc=toc),
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=section_selection_schema,
        temperature=0,
        thinking_config=types.ThinkingConfig(thinking_level="low")
),
)
return response.content