'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [textboxExpanded, setTextboxExpanded] = useState(false);
  const [textboxInput, setTextboxInput] = useState('');
  const [textboxValid, setTextboxValid] = useState(true);

  const [topTextboxExpanded, setTopTextboxExpanded] = useState(false);
  const [topTextboxInput, setTopTextboxInput] = useState('');
  const [topTextboxValid, setTopTextboxValid] = useState(true);

  const [showComments, setShowComments] = useState<number|null>(null)
  const [commentInput, setCommentInput] = useState('');
  const [commentInputValid, setCommentInputValid] = useState(true);
  const [comments, setComments] = useState<any[]|null>(null)
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const updateMessages = () => {
    fetch(api_url + '/message/top')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setData(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    updateMessages();
  }, []);

  const handleExpandTextBox = () => {
    setTextboxInput('');
    setTextboxExpanded(!textboxExpanded);
  };

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {
      const value = textboxInput;
      // Regular expression to check for emoji characters
      const emojiRegex = /^([\p{Emoji}\s\n]+)$/u;

      console.log(value)
      // Validate input: only allow emojis
      if (emojiRegex.test(value) || value === '') {

      } else {
        console.log("Only emojis")
        return;
      }
      

      const lines = textboxInput.split('\n');
      const title = lines[0]; // First line as title
      const content = lines.slice(1).join('\n'); // Rest as contents
      const time = new Date().toISOString(); // Current datetime in ISO format

      const payload = {
        title,
        content,
        time,
      };

      //console.log(payload)
    
      const response = await fetch(api_url + '/message/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      //console.log('Response:', response.json);
      setTextboxInput(''); // Clear the input after submission
      setTextboxExpanded(false); // Optionally collapse after submission
      updateMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmitTopTextbox = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {
      const value = topTextboxInput;
      // Regular expression to check for emoji characters
      const emojiRegex = /^([\p{Emoji}\s\n]+)$/u;

      console.log(value)
      // Validate input: only allow emojis
      if (emojiRegex.test(value) || value === '') {

      } else {
        console.log("Only emojis")
        return;
      }
      

      const lines = topTextboxInput.split('\n');
      const title = lines[0]; // First line as title
      const content = lines.slice(1).join('\n'); // Rest as contents
      const time = new Date().toISOString(); // Current datetime in ISO format

      const payload = {
        title,
        content,
        time,
      };

      //console.log(payload)
    
      const response = await fetch(api_url + '/message/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      //console.log('Response:', response.json);
      setTopTextboxInput(''); // Clear the input after submission
      updateMessages();
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleChange = (e: React.ChangeEvent<any>) => {
    setTextboxInput(e.target.value)
  };

  const handleChangeTopTextbox = (e: React.ChangeEvent<any>) => {
    setTopTextboxInput(e.target.value)
  };

  useEffect(()=>{
    const value = textboxInput;
    const emojiRegex = /^([\p{Emoji}\s\n]+)$/u;

    if (emojiRegex.test(value)) {
      if (!textboxValid) {
        setTextboxValid(true)
        console.log("valid")
      }
    } else {
      if (textboxValid) {
        setTextboxValid(false)
        console.log("invalid")
      }
    }
  }, [textboxInput])

  useEffect(()=>{
    const value = topTextboxInput;
    const emojiRegex = /^([\p{Emoji}\s\n]+)$/u;

    if (emojiRegex.test(value)) {
      if (!topTextboxValid) {
        setTopTextboxValid(true)
        console.log("valid")
      }
    } else {
      if (topTextboxValid) {
        setTopTextboxValid(false)
        console.log("invalid")
      }
    }
  }, [topTextboxInput])

  useEffect(()=>{
    const value = commentInput;
    const emojiRegex = /^([\p{Emoji}\s\n]+)$/u;

    if (emojiRegex.test(value)) {
      if (!commentInputValid) {
        setCommentInputValid(true)
        console.log("valid")
      }
    } else {
      if (commentInputValid) {
        setCommentInputValid(false)
        console.log("invalid")
      }
    }
  }, [commentInput])

  const convertNumberToEmoji = (number: string) => {
    const digits = String(number).split('');
    
    // Map each digit to its emoji representation
    const emojiDigits = digits.map(digit => {
        return String.fromCodePoint(0x0030 + parseInt(digit)) + "\uFE0F\u20E3"; // Adding the emoji variation and combining character
    });
    
    // Join the emoji digits back into a single string
    return emojiDigits.join('');
  }

  const loadComments = (id: number) => {
    fetch(api_url + '/message/top?parentId='+id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setComments(data);
      });
  }

  const toggleComments = (id: number) => {
    if (showComments == id) {
      setCommentInput("");
      setShowComments(null);
      setComments(null);
    } else {
      setCommentInput("");
      setShowComments(id);
      loadComments(id);
    }
  }

  const handleSubmitComment = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {
      if (!commentInputValid) return;
      if (showComments == null) return;

      const lines = commentInput.split('\n');
      const title = lines[0]; // First line as title
      const content = lines.slice(1).join('\n'); // Rest as contents
      const time = new Date().toISOString(); // Current datetime in ISO format
      const parentId = showComments

      const payload = {
        title,
        content,
        time,
        parentId
      };

      //console.log(payload)
    
      const response = await fetch(api_url + '/message/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      //console.log('Response:', response.json);
      setCommentInput(''); // Clear the input after submission
      //updateMessages();
      loadComments(showComments);
      data.find(i => i.id == showComments).totalChildrenCount += 1;
    } catch (error) {
      //console.error('Error:', error);
    }
  };

  const handleTranslate = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {

      const content = textboxInput

      const payload = {
        content
      };

      //console.log(payload)
    
      const response = await fetch(api_url + '/message/translate', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      }).then((response) => response.json())
        .then((data) => {
        setTextboxInput(data.text.replace(/[^\p{Emoji}\s]+/gu, '').replace(/\s{2,}/g, ' '));
      });
      //updateMessages();
    } catch (error) {
      //console.error('Error:', error);
    }
  };

  const handleTranslateTopTextbox = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {

      const content = topTextboxInput

      const payload = {
        content
      };

      //console.log(payload)
    
      const response = await fetch(api_url + '/message/translate', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      }).then((response) => response.json())
        .then((data) => {
        setTopTextboxInput(data.text.replace(/[^\p{Emoji}\s]+/gu, '').replace(/\s{2,}/g, ' '));
      });
      //updateMessages();
    } catch (error) {
      //console.error('Error:', error);
    }
  };

  const handleTranslateComment = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    try {

      const content = commentInput

      const payload = {
        content
      };

      //console.log(payload)
    
      const response = await fetch(api_url + '/message/translate', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      }).then((response) => response.json())
        .then((data) => {
        setCommentInput(data.text.replace(/[^\p{Emoji}\s]+/gu, '').replace(/\s{2,}/g, ' '));
      });
      //updateMessages();
    } catch (error) {
      //console.error('Error:', error);
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen overflow-hidden">
      <main className="flex flex-col items-center bg-gray-100 dark:bg-black">
        <div className="p-3">
          💬
        </div>
        <div className="h-screen rounded-lg border border-gray-700 overflow-hidden">
          <div className="h-full flex flex-col w-100 max-w-[500px] max-w-screen bg-gray-50 dark:bg-[#181818] divide-y divide-gray-700 overflow-y-scroll">
            {
              <div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out max-h-40`}
                >
                  <form id="top-text-form" onSubmit={handleSubmitTopTextbox} className="">
                    <textarea
                      title="🚫🔤"
                      value={topTextboxInput}
                      style={{resize: "none"}}
                      onChange={(e)=>{
                        handleChangeTopTextbox(e);
                        /*
                        const value = textboxInput;
                          const emojiRegex = /^[\p{Emoji}\s\n]+$/u
                          if (emojiRegex.test(value) || value === '') {
                            console.log('qweqweqwe');
                            (e.target as HTMLTextAreaElement).setCustomValidity('')
                          } else {
                            console.log('kkk');
                            (e.target as HTMLTextAreaElement).setCustomValidity('🚫🔤')
                        }*/
                      }}
                      className="h-auto w-50 sm:w-100 p-2 rounded-lg accent-transparent focus:outline-hidden"
                      placeholder="🗣️🗣️🗣️"
                      required
                      //onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('‼️')}
                    />
                    
                  </form>
                </div>

                <div className={`flex w-full justify-between p-2`}>

                  <div className="flex">
                    <button
                      onClick={()=>{setTopTextboxInput('')}}
                      className={`rounded-lg transition duration-300`}
                    >
                      🧹
                    </button>

                    <div className={`ms-2 transition duration-500 ${ topTextboxValid ? 'opacity-0' : 'opacity-100' }`}>
                      🚫🔤
                    </div>

                  </div>


                  <div className="flex">
                    <button
                      onClick={handleTranslateTopTextbox}
                      className={`bg-transparent cursor-pointer rounded-lg focus:outline-none rounded-lg text-white transition duration-300`}
                    >
                      🤖
                    </button>
                    <button
                      form="top-text-form"
                      type="submit"
                      className={`bg-transparent cursor-pointer text-white rounded-lg focus:outline-none rounded-lg text-white transition duration-300 ms-2`}
                    >
                      📢
                    </button>
                  </div>
                </div>
              </div>
            }
            {
              !loading &&
              data.map((e) => (
                <div key={e.id} className="px-3 py-1">
                  <p>{e.title}</p>
                  <p>{e.content}</p>
                  <p className="cursor-pointer" onClick={()=>{toggleComments(e.id)}}>💬{convertNumberToEmoji(e.totalChildrenCount)}</p>
                  <div
                      className={`transition-all duration-300 ease-in-out ${
                        showComments == e.id ? 'max-h-full opacity-100' : 'w-0 max-h-0 opacity-0'
                      }`}
                    >
                      {
                        comments == null &&
                        <div>⏳</div>
                      }
                      {
                        comments != null &&
                        <div className="ps-3 py-1">
                          <div className="relative">
                            <form id="comment-form" onSubmit={handleSubmitComment} className="flex border rounded-lg">
                              <input
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                className="h-auto grow ps-1 me-2 accent-transparent focus:outline-hidden"
                                placeholder="🗣️🗣️🗣️"
                                required
                                onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('‼️🚫🔤')}
                                onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
                              />
                              <button
                                onClick={handleTranslateComment}
                                className={`bg-transparent cursor-pointer rounded-lg focus:outline-none rounded-lg`}
                              >
                                🤖
                              </button>
                              <button
                                form="comment-form"
                                type="submit"
                                className={`bg-transparent text-white rounded-lg focus:outline-none rounded-lg bg-blue-500 text-white p-1`}
                              >
                                📢
                              </button>
                            </form>
                            <div className={`absolute inset-x-0 -top-6 w-full text-right transition duration-500 ${ commentInputValid ? 'opacity-0' : 'opacity-100' }`}>
                              ‼️🚫🔤
                            </div>
                          </div>
                          {
                            comments.map((e) => (
                              <div key={e.id} className="mt-2">
                                <p>{e.title}</p>
                                <p>{e.content}</p>
                              </div>
                            ))
                          }
                        </div>
                      }
                  </div>
                </div>
              ))
            }
            <div>
              <br/><br/><br/><br/>
            </div>
          </div>
        </div>
      </main>
      <footer className={`fixed bottom-0 right-0 mb-6 me-6 flex flex-col flex-wrap items-center justify-end
        bg-white dark:bg-[#181818] rounded-lg  ${
          textboxExpanded ? 'border border-gray-700' : ''
        }`}>

        <button
            onClick={handleExpandTextBox}
            className={`rounded-lg border bg-blue-500 text-white p-2 transition duration-300 border border-gray-700 ${
              textboxExpanded ? 'hidden' : ''
            }`}
          >
          ✍️
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            textboxExpanded ? 'max-h-40 opacity-100' : 'w-0 max-h-0 opacity-0'
          }`}
        >
          <form id="text-form" onSubmit={handleSubmit} className="">
            <textarea
              title="🚫🔤"
              value={textboxInput}
              style={{resize: "none"}}
              onChange={(e)=>{
                handleChange(e);
                /*
                const value = textboxInput;
                  const emojiRegex = /^[\p{Emoji}\s\n]+$/u
                  if (emojiRegex.test(value) || value === '') {
                    console.log('qweqweqwe');
                    (e.target as HTMLTextAreaElement).setCustomValidity('')
                  } else {
                    console.log('kkk');
                    (e.target as HTMLTextAreaElement).setCustomValidity('🚫🔤')
                }*/
              }}
              className="h-auto w-50 sm:w-100 p-2 rounded-lg accent-transparent focus:outline-hidden"
              placeholder="🗣️🗣️🗣️"
              required
              //onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('‼️')}
            />
            
          </form>
        </div>

        <div className={`flex w-full justify-between p-2 ${ textboxExpanded ? '' : 'hidden' }`}>

          <div className="flex">
            <button
              onClick={handleExpandTextBox}
              className={`rounded-lg transition duration-300 ${
                textboxExpanded ? '' : 'hidden'
              }`}
            >
              🧹
            </button>

            <div className={`ms-2 transition duration-500 ${ textboxValid ? 'opacity-0' : 'opacity-100' }`}>
              🚫🔤
            </div>

          </div>


          <div className="flex">
            <button
              onClick={handleTranslate}
              className={`bg-transparent cursor-pointer rounded-lg focus:outline-none rounded-lg text-white transition duration-300 ${
                textboxExpanded ? '' : 'hidden'
              }`}
            >
              🤖
            </button>
            <button
              form="text-form"
              type="submit"
              className={`bg-transparent cursor-pointer text-white rounded-lg focus:outline-none rounded-lg text-white transition duration-300 ms-2 ${
                textboxExpanded ? '' : 'hidden'
              }`}
            >
              📢
            </button>
          </div>
        </div>
        
        
      </footer>
    </div>
  );
}
