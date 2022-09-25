module.exports = {
  endpoints: [
    {
      path: "/",
      method: "GET",
      parameters: null,
      description: "List API endpoints."
    },
    {
      path: "/play",
      method: "GET",
      parameters: [
        {
          name: "guess",
          type: "string",
          required: "true",
          description: "A five-letter guess at the puzzle solution."
        },
        {
          name: "game",
          type: "UUID",
          required: "false",
          description: "The ID of a game in progress.  If omitted, a new game will be started."
        }
      ],
      description: "Start a new game or submit a guess to a game in progress."
    }
  ]
}
